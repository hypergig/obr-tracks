import OBR, { Metadata } from "@owlbear-rodeo/sdk"
import { logEvent } from "firebase/analytics"
import { v4 as uuidv4 } from "uuid"
import { ObrError } from "./errors"
import { analytics } from "./firebase"
import { key } from "./key"
import { now } from "./time"
import { Track } from "./track"
import { getSeconds } from "./utils"

const path = key("control")

export enum Action {
  Play,
  Pause,
}

export interface Message {
  id: string
  time: Date
  action: Action
  offset: number
  track: Track
}

function newPlayMessage(track: Track): Message {
  return {
    id: uuidv4(),
    time: now(),
    action: Action.Play,
    offset: 0,
    track: track,
  }
}

function pauseCurrentMessage(): Message {
  if (!currentMessage) {
    throw new ObrError(
      "unable to pause before receiving first message",
      currentMessage,
    )
  }

  const m = newPlayMessage(currentMessage.track)
  m.action = Action.Pause
  m.offset = currentMessage.offset + getSeconds(currentMessage.time)
  return m
}

function resumeCurrentMessage(): Message {
  if (!currentMessage) {
    throw new ObrError(
      "unable to resume before receiving first message",
      currentMessage,
    )
  }

  const m = newPlayMessage(currentMessage.track)
  m.action = Action.Play
  m.offset = currentMessage.offset
  return m
}

// message cache
let currentMessage: Message | undefined = undefined

function isMessage(value: unknown): value is Message {
  return (value as Message) !== undefined
}

function extractMessage(metadata: Metadata): Message | undefined {
  const data = metadata[path]
  if (isMessage(data)) {
    return data
  }
  return undefined
}

export function onMessage(
  callback: (message: Message | undefined) => void,
): () => void {
  const handler = (m: Metadata) => {
    const message = extractMessage(m)
    if (message?.id !== currentMessage?.id) {
      // A future message means means there is a massive clock skew issue,
      // so don't allow it. Instead, set the message time to now.
      const n = now()
      if (message && new Date(message.time).getTime() > n.getTime()) {
        console.warn(
          `message came from the future\nmessage time: ${message.time}\nnow: ${n}\nsetting message time to now`,
        )
        message.time = n
      }

      logEvent(analytics, "message_received", { action: message?.action })
      currentMessage = message
      console.log(`now: ${n}\ntracks message: `, message)
      callback(currentMessage)
    }
  }

  OBR.room.getMetadata().then(handler)
  return OBR.room.onMetadataChange(handler)
}

export function play(track: Track) {
  logEvent(analytics, "play")
  OBR.room.setMetadata({
    [path]: newPlayMessage(track),
  })
}

export function pause() {
  logEvent(analytics, "pause")
  OBR.room.setMetadata({
    [path]: pauseCurrentMessage(),
  })
}

export function resume() {
  logEvent(analytics, "resume")
  OBR.room.setMetadata({
    [path]: resumeCurrentMessage(),
  })
}

export function stop() {
  logEvent(analytics, "stop")
  OBR.room.setMetadata({
    [path]: undefined,
  })
}

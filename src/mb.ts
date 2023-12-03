import OBR, { Metadata } from "@owlbear-rodeo/sdk"
import { logEvent } from "firebase/analytics"
import { v4 as uuidv4 } from "uuid"
import { ObrError } from "./errors"
import { analytics } from "./firebase"
import { key } from "./key"
import { now } from "./time"
import { Track } from "./track"
import { checkTrack, getSeconds } from "./utils"

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
  duration: number
  track: Track
}

function newPlayMessage(track: Track, duration: number): Message {
  return {
    id: uuidv4(),
    time: now(),
    action: Action.Play,
    offset: 0,
    duration: duration,
    track: track,
  }
}

function pauseCurrentMessage(): Message {
  if (!currentMessage) {
    throw new ObrError("Unable to pause before receiving first message")
  }

  const m = newPlayMessage(currentMessage.track, currentMessage.duration)
  m.action = Action.Pause
  m.offset = currentMessage.offset + getSeconds(currentMessage.time)
  return m
}

function resumeCurrentMessage(): Message {
  if (!currentMessage) {
    throw new ObrError("Unable to resume before receiving first message")
  }

  const m = newPlayMessage(currentMessage.track, currentMessage.duration)
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

  // validate the track
  const { fixed, validation } = checkTrack(track)
  if (validation) {
    throw new ObrError("Track validation failed", fixed, validation)
  }

  // test the url
  const audio = new Audio()
  audio.preload = "metadata"
  audio.onerror = () => {
    throw new ObrError("Audio error: Unable to play track", fixed)
  }
  audio.onloadedmetadata = () => {
    OBR.room.setMetadata({
      [path]: newPlayMessage(track, audio.duration),
    })
  }

  audio.src = fixed.url
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

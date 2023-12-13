import { useEffect, useRef } from "react"
import { Action } from "../mb"
import { getSeconds } from "../utils"
import { useMessage } from "./MessageProvider"
import { TrackProgress } from "./TrackProgress"

interface AudioProps {
  ready: boolean
  volume: number
  mute: boolean
}

export function Audio(props: AudioProps) {
  const { ready, volume, mute } = props
  const currentMessage = useMessage()

  const ref = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (ref.current && currentMessage && ready) {
      switch (currentMessage.action) {
        case Action.Play:
          ref.current.currentTime =
            (currentMessage.offset + getSeconds(currentMessage.time)) %
            currentMessage.duration
          ref.current.paused && ref.current.play()
          break
        case Action.Pause:
          ref.current.currentTime =
            currentMessage.offset % currentMessage.duration
          ref.current.paused || ref.current.pause()
          break
      }
    }
  }, [ready, currentMessage])

  return (
    <>
      <audio
        id="tracks-audio-player"
        ref={ref}
        src={currentMessage ? currentMessage.track.url : ""}
        autoPlay={false}
        preload="auto"
        controls={false}
        loop={true}
        muted={mute}
      />
      <TrackProgress />
    </>
  )
}

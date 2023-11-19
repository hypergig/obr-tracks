import { useEffect, useMemo, useRef, useState } from "react";
import { useMessage } from "./MessageProvider";
import { TrackProgress } from "./TrackProgress";
import { Action } from "../mb";
import { convertGoogleDrive, getSeconds } from "../utils";

interface AudioProps {
  ready: boolean;
  volume: number;
  mute: boolean;
}

export function Audio(props: AudioProps) {
  const { ready, volume, mute } = props;
  const currentMessage = useMessage();
  const [duration, setDuration] = useState<number | undefined>(undefined);

  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (ref.current && currentMessage && duration && ready) {
      switch (currentMessage.action) {
        case Action.Play:
          ref.current.currentTime =
            (currentMessage.offset + getSeconds(currentMessage.time)) %
            duration;
          ref.current.paused && ref.current.play();
          break;
        case Action.Pause:
          ref.current.currentTime = currentMessage.offset % duration;
          ref.current.paused || ref.current.pause();
          break;
      }
    }
  }, [ready, currentMessage, duration]);

  const url = useMemo(() => {
    if (currentMessage) {
      return convertGoogleDrive(currentMessage.track.url);
    }
    return "";
  }, [currentMessage?.track.url]);

  return (
    <>
      <audio
        id="tracks-audio-player"
        ref={ref}
        src={url}
        autoPlay={false}
        preload="auto"
        controls={false}
        loop={true}
        muted={mute}
        onLoadedMetadata={(e) => {
          setDuration((e.target as HTMLAudioElement).duration);
        }}
      />
      <TrackProgress duration={duration} />
    </>
  );
}

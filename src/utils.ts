import { logEvent } from "firebase/analytics"
import { ObrError } from "./errors"
import { analytics } from "./firebase"
import { now } from "./time"
import { Track } from "./track"

// get number of seconds between two times
export function getSeconds(time: Date) {
  return (now().getTime() - new Date(time).getTime()) / 1000
}

// if url is a google drive share link, it changes it into a direct download url, if it isn't do nothing
export function convertGoogleDrive(driveUrl: string): string {
  const { fixed, validation } = checkUrl(driveUrl)
  if (validation) {
    throw new ObrError(validation, fixed)
  }

  const url = new URL(fixed)

  logEvent(analytics, "audio_src", { src: url.hostname })

  if (
    url.hostname === "drive.google.com" &&
    url.pathname.startsWith("/file/d/")
  ) {
    return `https://drive.google.com/uc?export=download&id=${url.pathname.split("/")[3]
      }`
  }

  return driveUrl
}

export interface CheckResult<Type> {
  fixed: Type
  validation: string
}

export function checkTitle(title: string): CheckResult<string> {
  const fixed = title.trim()
  const validation = fixed || "Title can not be blank"
  return { fixed, validation }
}

export function checkUrl(url: string): CheckResult<string> {
  const fixed = url.trim()

  try {
    new URL(fixed)
  } catch {
    return { fixed, validation: "Invalid url" }
  }

  if (!url.endsWith(".mp3")) {
    return { fixed, validation: "Url must be of an mp3 file" }
  }

  return { fixed, validation: "" }
}

export function checkTags(tags: string[]): CheckResult<string[]> {
  return { fixed: tags.filter(t => t).map(t => t.trim()), validation: "" }
}

export function checkTrack(track: Track): CheckResult<Track> {
  const { fixed: title, validation: titleValidation } = checkTitle(track.title)
  const { fixed: url, validation: urlValidation } = checkUrl(track.url)
  const { fixed: tags, validation: tagsValidation } = checkTags(track.tags)

  return {
    fixed: { title, url, tags },
    validation: [titleValidation, urlValidation, tagsValidation].join(",")
  }
}

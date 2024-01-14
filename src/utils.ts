import { now } from "./time"
import { Track } from "./track"

// get number of seconds between two times
export function getSeconds(time: Date) {
  return (now().getTime() - new Date(time).getTime()) / 1000
}

export interface CheckResult<F, V> {
  fixed: F
  validation?: V
}

export function checkTitle(title: string): CheckResult<string, string> {
  const fixed = title.trim()
  return { fixed, validation: fixed ? undefined : "Title can not be blank" }
}

export function checkUrl(url: string): CheckResult<string, string> {
  const fixed = url.trim()

  try {
    const urlObject = new URL(fixed)
    if (urlObject.hostname === "drive.google.com") {
      return {
        fixed,
        validation:
          "Google Drive no longer supports this type of usage, please consider an alternative file sharing service",
      }
    }
  } catch {
    return { fixed, validation: "Invalid url" }
  }

  return { fixed }
}

export function checkTags(tags: string[]): CheckResult<string[], string> {
  return { fixed: tags.filter(t => t).map(t => t.trim()) }
}

export interface TrackValidation {
  titleValidation?: string
  urlValidation?: string
  tagsValidation?: string
}

export function checkTrack(
  track: Track,
): CheckResult<Track, TrackValidation | undefined> {
  const { fixed: title, validation: titleValidation } = checkTitle(track.title)
  const { fixed: url, validation: urlValidation } = checkUrl(track.url)
  const { fixed: tags, validation: tagsValidation } = checkTags(track.tags)

  return {
    fixed: { title, url, tags },
    validation:
      titleValidation || urlValidation || tagsValidation
        ? { titleValidation, urlValidation, tagsValidation }
        : undefined,
  }
}

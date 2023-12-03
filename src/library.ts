import { EventEmitter } from "events"
import { logEvent } from "firebase/analytics"
import { ObrError } from "./errors"
import { analytics } from "./firebase"
import { key } from "./key"
import { Track } from "./track"
import { checkTrack } from "./utils"

const path = key("library")
const eventEmitter = new EventEmitter()

function push() {
  eventEmitter.emit(path, getLibrary())
}

function set(tracks: Track[]) {
  localStorage.setItem(path, JSON.stringify(tracks))
  push()
}

export function addTrackToLibrary(track: Track) {
  logEvent(analytics, "add_track")
  mergeLibrary([track])
}

export function deleteTrackFromLibrary(track: Track) {
  logEvent(analytics, "delete_track")
  set(getLibrary().filter(t => t.url !== track.url))
}

export function mergeLibrary(tracks: Track[]) {
  const currentLibrary = getLibrary()
  const newTracks: Track[] = []
  tracks.forEach(t => {
    let updated = false
    currentLibrary.forEach(currentTrack => {
      const { fixed, validation } = checkTrack(t)
      if (validation) {
        throw new ObrError(
          Object.values(validation)
            .filter(e => e)
            .join(", "),
          fixed,
        )
      }

      if (currentTrack.url === fixed.url) {
        currentTrack.title = fixed.title
        currentTrack.tags = fixed.tags
        updated = true
      }
    })

    if (!updated) {
      newTracks.push(t)
    }
  })
  set([...newTracks, ...currentLibrary])
}

export function getLibrary(): Track[] {
  return JSON.parse(localStorage.getItem(path) ?? "[]").map((t: Track) => t)
}

export function clearLibrary() {
  logEvent(analytics, "clear_tracks")
  localStorage.removeItem(path)
  push()
}

export function onLibraryChange(
  callback: (tracks: Track[]) => void,
): () => void {
  callback(getLibrary())
  eventEmitter.addListener(path, callback)
  return () => eventEmitter.removeListener(path, callback)
}

// clean the library
export function cleanLibrary() {
  set(
    getLibrary().map(t => {
      const { fixed, validation } = checkTrack(t)
      if (validation) {
        console.warn(
          `Bad track in library, you should probably delete it: ${Object.values(
            validation,
          )
            .filter(e => e)
            .join(", ")}`,
          fixed,
        )
      }
      return fixed
    }),
  )
}

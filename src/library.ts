import { EventEmitter } from "events";
import { logEvent } from "firebase/analytics";
import { analytics } from "./firebase";
import { key } from "./key";
import { Track } from "./track";

const path = key("library");
const eventEmitter = new EventEmitter();

function push() {
  eventEmitter.emit(path, getLibrary());
}

function set(tracks: Track[]) {
  localStorage.setItem(path, JSON.stringify(tracks));
  push();
}

export function addTrackToLibrary(track: Track) {
  logEvent(analytics, "add_track");
  mergeLibrary([track]);
}

export function deleteTrackFromLibrary(track: Track) {
  logEvent(analytics, "delete_track");
  set(getLibrary().filter((t) => t.url !== track.url));
}

export function mergeLibrary(tracks: Track[]) {
  const currentLibrary = getLibrary();
  const newTracks: Track[] = [];
  tracks.forEach((t) => {
    let updated = false;
    currentLibrary.forEach((currentTrack) => {
      if (currentTrack.url === t.url) {
        currentTrack.title = t.title;
        currentTrack.tags = t.tags;
        updated = true;
      }
    });

    if (!updated) {
      newTracks.push(t);
    }
  });
  set([...newTracks, ...currentLibrary]);
}

export function getLibrary(): Track[] {
  return JSON.parse(localStorage.getItem(path) ?? "[]");
}

export function clearLibrary() {
  logEvent(analytics, "clear_tracks");
  localStorage.removeItem(path);
  push();
}

export function onLibraryChange(
  callback: (tracks: Track[]) => void,
): () => void {
  callback(getLibrary());
  eventEmitter.addListener(path, callback);
  return () => eventEmitter.removeListener(path, callback);
}

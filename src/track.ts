export interface Track {
  title: string
  url: string
  tags: string[]
}

export function toString(track: Track): string {
  return `Title: ${track.title}: Url: ${track.url}`
}

export function emptyTrack(): Track {
  String()
  return {
    title: "",
    url: "",
    tags: [],
  }
}

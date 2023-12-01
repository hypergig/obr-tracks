export interface Track {
  title: string
  url: string
  tags: string[]
}

export const emptyTrack: Track = {
  title: "",
  url: "",
  tags: []
}

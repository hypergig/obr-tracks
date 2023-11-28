import {
  Autocomplete,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material"
import { useEffect, useState } from "react"
import { addTrackToLibrary } from "../library"
import { Track } from "../track"
import { validateTitle, validateUrl } from "../utils"

interface Props {
  onClose: () => void
  tagSuggestions: string[]
  track?: Track | null
}

export function TrackDialog(props: Props) {
  const { onClose, tagSuggestions, track } = props

  // TODO - move this into a reducer
  const [title, setTitle] = useState<string>("")
  const [titleError, setTitleError] = useState<string>("")

  const [url, setUrl] = useState<string>("")
  const [urlError, setUrlError] = useState<string>("")

  const [tags, setTags] = useState<string[]>([])

  const handleClose = () => {
    setTitle("")
    setTitleError("")

    setUrl("")
    setUrlError("")

    setTags([])

    onClose()
  }

  useEffect(() => {
    setTitle(track?.title ?? "")
    setUrl(track?.url ?? "")
    setTags(track?.tags ?? [])
  }, [track])

  return (
    <Dialog fullWidth open={track !== null} onClose={handleClose}>
      <DialogTitle>{track ? "Edit Track" : "New Track"}</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <TextField
            error={titleError !== ""}
            helperText={titleError}
            autoComplete="off"
            value={title}
            variant="standard"
            label="Title"
            onChange={e => setTitle(e.target.value)}
            type="text"
          />
          <TextField
            error={urlError !== ""}
            helperText={urlError}
            autoComplete="off"
            value={url}
            disabled={track !== undefined && track !== null}
            variant="standard"
            label="Url"
            onChange={e => setUrl(e.target.value.trim())}
            type="url"
          />
          <Autocomplete
            value={tags}
            multiple
            freeSolo
            onChange={(_, v) => setTags(v)}
            options={tagSuggestions}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={params => (
              <TextField {...params} variant="standard" label="Tags" />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            const t = validateTitle(title)
            const u = validateUrl(url)
            if (t !== "" || u !== "") {
              setTitleError(t)
              setUrlError(u)
            } else {
              setTitle(v => v.trim())
              setUrl(v => v.trim())
              addTrackToLibrary({ title: title, url: url, tags: tags })
              handleClose()
            }
          }}
        >
          Save
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  )
}

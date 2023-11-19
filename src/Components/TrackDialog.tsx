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
} from "@mui/material";
import { useEffect, useState } from "react";
import { addTrackToLibrary } from "../library";
import { Track } from "../track";

interface Props {
  onClose: () => void;
  tagSuggestions: string[];
  track?: Track | null;
}

export function TrackDialog(props: Props) {
  const { onClose, tagSuggestions, track } = props;
  const [title, setTitle] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setTitle(track?.title ?? "");
    setUrl(track?.url ?? "");
    setTags(track?.tags ?? []);
  }, [track]);

  return (
    <Dialog fullWidth open={track !== null} onClose={onClose}>
      <DialogTitle>{track ? "Edit Track" : "New Track"}</DialogTitle>
      <DialogContent>
        <Stack spacing={4}>
          <TextField
            autoComplete="off"
            value={title}
            variant="standard"
            label="Title"
            onChange={(e) => setTitle(e.target.value)}
            type="text"
          />
          <TextField
            autoComplete="off"
            value={url}
            disabled={track !== undefined && track !== null}
            variant="standard"
            label="Url"
            onChange={(e) => setUrl(e.target.value)}
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
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Tags" />
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            addTrackToLibrary({ title: title, url: url, tags: tags });
            onClose();
          }}
        >
          Save
        </Button>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}

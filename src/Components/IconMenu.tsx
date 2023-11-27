import AddIcon from "@mui/icons-material/AddRounded"
import DeleteIcon from "@mui/icons-material/DeleteForeverRounded"
import DownloadIcon from "@mui/icons-material/FileDownloadRounded"
import UploadIcon from "@mui/icons-material/FileUploadRounded"
import MenuIcon from "@mui/icons-material/MenuRounded"
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  useTheme,
} from "@mui/material"
import { logEvent } from "firebase/analytics"
import { useState } from "react"
import { ConfirmPayload } from "./Confirm"
import { TracksToCsv, csvToTracks } from "../csv"
import { ObrError } from "../errors"
import { analytics } from "../firebase"
import { clearLibrary, getLibrary, mergeLibrary } from "../library"

const importButton = () => {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = "text/csv"
  input.multiple = false
  input.onchange = () => {
    if (input.files?.length !== 1) {
      throw new ObrError("missingCsvFile", "must select at least 1 csv file")
    }
    input.files[0].text().then(t => {
      const tracks = csvToTracks(t)
      logEvent(analytics, "import", { count: tracks.length })
      mergeLibrary(tracks)
    })
  }
  input.click()
}

const exportButton = () => {
  const tracks = getLibrary()
  const a = document.createElement("a")
  a.href = URL.createObjectURL(new Blob([TracksToCsv(tracks)]))
  a.download = "tracks.csv"
  a.click()
  logEvent(analytics, "export", { count: tracks.length })
}

interface Props {
  confirm: (payload: ConfirmPayload) => void
  openTrackDialog: () => void
}

export function IconMenu(props: Props) {
  const { confirm, openTrackDialog } = props

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const theme = useTheme()
  return (
    <>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuList>
          <MenuItem
            onClick={() => {
              handleClose()
              openTrackDialog()
            }}
            divider
          >
            <ListItemIcon>
              <AddIcon />
            </ListItemIcon>
            <ListItemText>Add Track</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              importButton()
            }}
          >
            <ListItemIcon>
              <UploadIcon />
            </ListItemIcon>
            <ListItemText>Import csv</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleClose()
              exportButton()
            }}
            divider
          >
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText>Export csv</ListItemText>
          </MenuItem>
          <MenuItem
            color={"red"}
            onClick={() => {
              handleClose()
              confirm({
                message: "This will clear your entire track library.",
                action: clearLibrary,
              })
            }}
          >
            <ListItemIcon>
              <DeleteIcon color="error" />
            </ListItemIcon>
            <ListItemText sx={{ color: theme.palette.error.main }}>
              Clear All Tracks
            </ListItemText>
          </MenuItem>
        </MenuList>
      </Menu>
    </>
  )
}

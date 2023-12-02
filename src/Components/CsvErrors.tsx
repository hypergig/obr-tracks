import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from "@mui/material"
import { Stack } from "@mui/system"
import { TrackValidation } from "../utils"

export interface CsvError {
  row: number
  validation: TrackValidation
}

interface Props {
  errors: CsvError[]
  onClose(): void
}

export function CsvErrors(props: Props) {
  const { errors, onClose } = props
  const theme = useTheme()
  return (
    <Dialog fullWidth open={errors.length > 0} onClose={onClose}>
      <DialogTitle sx={{ flexGrow: 1 }}>
        <Stack alignItems={"center"} direction={"row"} spacing={1}>
          <ErrorOutlineRoundedIcon color="error" />
          <div>CSV Issues</div>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ overflowY: "unset" }}>
        <DialogContentText variant="subtitle2">
          The following rows have errors which prevent importing. Please fix
          them and try again.
        </DialogContentText>
      </DialogContent>
      <DialogContent
        sx={{
          overflowY: "unset",
          paddingY: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <Table sx={{ minWidth: "100%" }}>
          <TableHead>
            <TableRow>
              <TableCell>Row</TableCell>
              <TableCell align="right">Errors</TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </DialogContent>
      <DialogContent
        sx={{
          paddingY: 0,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* <TableContainer component={Paper}> */}
        <Table sx={{ minWidth: "100%" }}>
          <TableBody>
            {errors.map(row => (
              <TableRow
                key={row.row}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{row.row}</TableCell>
                <TableCell align="right">
                  {Object.values(row.validation)
                    .filter(v => v)
                    .map(v => (
                      <div key={v}>{v}</div>
                    ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* </TableContainer> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
}

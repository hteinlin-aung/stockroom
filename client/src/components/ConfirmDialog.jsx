import {
  Alert, Button, Dialog, DialogActions,
  DialogContent, DialogTitle, Typography,
} from "@mui/material"

export default function ConfirmDialog({
  open, title, message, error, busy, onCancel, onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: error ? 2 : 0 }}>{message}</Typography>
        {error && <Alert severity="error">{error}</Alert>}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} autoFocus>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={busy}>
          {busy ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}


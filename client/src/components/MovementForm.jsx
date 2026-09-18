import { useState } from "react"
import { Alert, Box, Button, MenuItem, Paper, TextField, Typography } from "@mui/material"
import { api } from "../api.js"

export default function MovementForm({ productId, onRecorded }) {
  const [type, setType] = useState("in")
  const [quantity, setQuantity] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError("")

    try {
      await api.createMovement({
        product_id: productId,
        type,
        quantity: Number(quantity),
        note,
      })
      setQuantity("")
      setNote("")
      onRecorded()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Record a movement
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <TextField
          select
          label="Type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          sx={{ width: 150 }}
        >
          <MenuItem value="in">Stock in</MenuItem>
          <MenuItem value="out">Stock out</MenuItem>
          <MenuItem value="adjust">Adjustment</MenuItem>
        </TextField>

        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
          sx={{ width: 140 }}
        />

        <TextField
          label="Note"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          sx={{ flex: 1, minWidth: 200 }}
        />

        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? "Saving..." : "Record"}
        </Button>
      </Box>
    </Paper>
  )
}
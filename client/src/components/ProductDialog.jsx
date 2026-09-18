import { useEffect, useState } from "react"
import {
  Alert, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid, TextField,
} from "@mui/material"
import { api } from "../api.js"

const EMPTY = {
  sku: "",
  name: "",
  category: "",
  unit: "pcs",
  cost_price: "",
  sale_price: "",
  reorder_level: "",
}

export default function ProductDialog({ open, product, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        sku: product.sku,
        name: product.name,
        category: product.category || "",
        unit: product.unit,
        cost_price: product.cost_price,
        sale_price: product.sale_price,
        reorder_level: product.reorder_level,
      })
    } else {
      setForm(EMPTY)
    }
    setError("")
  }, [product, open])

  function handleChange(event) {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError("")

    const payload = {
      ...form,
      cost_price: Number(form.cost_price) || 0,
      sale_price: Number(form.sale_price) || 0,
      reorder_level: Number(form.reorder_level) || 0,
    }

    try {
      if (product) {
        await api.updateProduct(product.id, payload)
      } else {
        await api.createProduct(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <DialogTitle>{product ? "Edit product" : "Add product"}</DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="sku" label="SKU" value={form.sku}
                onChange={handleChange} fullWidth required autoFocus/>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="name" label="Name" value={form.name}
                onChange={handleChange} fullWidth required />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="category" label="Category" value={form.category}
                onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField name="unit" label="Unit" value={form.unit}
                onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField name="cost_price" label="Cost price" type="number"
                value={form.cost_price} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField name="sale_price" label="Sale price" type="number"
                value={form.sale_price} onChange={handleChange} fullWidth />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField name="reorder_level" label="Reorder at" type="number"
                value={form.reorder_level} onChange={handleChange} fullWidth />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
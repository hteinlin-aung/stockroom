import { useEffect, useState } from "react"
import {
  Alert, Box, Button, CircularProgress, IconButton, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { api } from "../api.js"
import ProductDialog from "../components/ProductDialog.jsx"
import ConfirmDialog from "../components/ConfirmDialog.jsx"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const [deleting, setDeleting] = useState(null)
  const [deleteError, setDeleteError] = useState("")
  const [deleteBusy, setDeleteBusy] = useState(false)

  async function loadProducts() {
    try {
      const data = await api.getProducts()
      setProducts(data)
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadProducts().finally(() => setLoading(false))
  }, [])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(product) {
    setEditing(product)
    setDialogOpen(true)
  }

  async function handleSaved() {
    setDialogOpen(false)
    await loadProducts()
  }

  function askDelete(product) {
    setDeleting(product)
    setDeleteError("")
  }

  async function confirmDelete() {
    setDeleteBusy(true)
    setDeleteError("")

    try {
      await api.deleteProduct(deleting.id)
      setDeleting(null)
      await loadProducts()
    } catch (err) {
      setDeleteError(err.message)
    } finally {
      setDeleteBusy(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ ml: "auto" }}>
          Add product
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {products.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography sx={{ mb: 1 }}>No products yet.</Typography>
          <Typography variant="body2" color="text.secondary">
            Add your first product to start tracking stock.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Reorder at</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category || "—"}</TableCell>
                  <TableCell align="right">{product.cost_price}</TableCell>
                  <TableCell align="right">{product.sale_price}</TableCell>
                  <TableCell align="right">{product.reorder_level}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => askDelete(product)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ProductDialog
        open={dialogOpen}
        product={editing}
        onClose={() => setDialogOpen(false)}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete product"
        message={deleting ? `Delete "${deleting.name}"? This cannot be undone.` : ""}
        error={deleteError}
        busy={deleteBusy}
        onCancel={() => setDeleting(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  )
}
import { useEffect, useState } from "react"
import {
  Alert, Box, Button, Chip, CircularProgress, FormControlLabel, IconButton,
  InputAdornment, Link, MenuItem, Paper, Switch, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Typography,
} from "@mui/material"
import { Link as RouterLink } from "react-router-dom"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SearchIcon from "@mui/icons-material/Search"
import { api } from "../api.js"
import ProductDialog from "../components/ProductDialog.jsx"
import ConfirmDialog from "../components/ConfirmDialog.jsx"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [lowOnly, setLowOnly] = useState(false)

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

  function clearFilters() {
    setSearch("")
    setCategory("all")
    setLowOnly(false)
  }

  // Every category that actually appears in the data, in alphabetical order.
  const categories = products
    .reduce((list, product) => {
      if (product.category && !list.includes(product.category)) {
        list.push(product.category)
      }
      return list
    }, [])
    .sort()

  // Start with everything, then narrow it down one filter at a time.
  function getVisibleProducts() {
    let visible = products

    if (search) {
      const term = search.toLowerCase()
      visible = visible.filter(
        (product) =>
          product.name.toLowerCase().includes(term) ||
          product.sku.toLowerCase().includes(term)
      )
    }

    if (category !== "all") {
      visible = visible.filter((product) => product.category === category)
    }

    if (lowOnly) {
      visible = visible.filter(
        (product) => product.currentStock <= product.reorder_level
      )
    }

    return visible
  }

  const visibleProducts = getVisibleProducts()
  const filtersOn = search !== "" || category !== "all" || lowOnly

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

      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small"
          placeholder="Search name or SKU"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          sx={{ flex: 1, minWidth: 220 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          select
          size="small"
          label="Category"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          sx={{ width: 180 }}
        >
          <MenuItem value="all">All categories</MenuItem>
          {categories.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={lowOnly}
              onChange={(event) => setLowOnly(event.target.checked)}
            />
          }
          label="Low stock only"
        />

        {filtersOn && <Button onClick={clearFilters}>Clear</Button>}
      </Paper>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Showing {visibleProducts.length} of {products.length} products
      </Typography>

      {products.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography sx={{ mb: 1 }}>No products yet.</Typography>
          <Typography variant="body2" color="text.secondary">
            Add your first product to start tracking stock.
          </Typography>
        </Paper>
      ) : visibleProducts.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography sx={{ mb: 1 }}>No products match these filters.</Typography>
          <Button onClick={clearFilters}>Clear filters</Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Reorder at</TableCell>
                <TableCell align="right">Cost</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/products/${product.id}`} underline="hover">
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.category || "—"}</TableCell>
                  <TableCell align="right">
                    {product.currentStock}
                    {product.currentStock <= product.reorder_level && (
                      <Chip size="small" color="warning" label="Low" sx={{ ml: 1 }} />
                    )}
                  </TableCell>
                  <TableCell align="right">{product.reorder_level}</TableCell>
                  <TableCell align="right">{product.cost_price}</TableCell>
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

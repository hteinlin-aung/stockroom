import { useEffect, useState } from "react"
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { api } from "../api.js"

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    api
      .getProducts()
      .then((data) => {
        if (!cancelled) setProducts(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Products
      </Typography>

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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
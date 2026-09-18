import { useEffect, useState } from "react"
import { useParams, Link as RouterLink } from "react-router-dom"
import {
  Alert, Box, Button, Chip, CircularProgress, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material"
import { api } from "../api.js"
import MovementForm from "../components/MovementForm.jsx"
import { MovementRow } from "../components/MovementRows.jsx"

export default function ProductDetail() {
  const { id } = useParams()

  const [product, setProduct] = useState(null)
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  async function load() {
    try {
      const [productData, movementData] = await Promise.all([
        api.getProduct(id),
        api.getMovements(id),
      ])
      setProduct(productData)
      setMovements(movementData)
      setError("")
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [id])

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

  const low = product.currentStock <= product.reorder_level

  return (
    <Box>
      <Button component={RouterLink} to="/products" sx={{ mb: 2 }}>
        ← Back to products
      </Button>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5">{product.name}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {product.sku} · {product.category || "Uncategorised"}
        </Typography>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" color="text.secondary">In stock</Typography>
            <Typography variant="h4">
              {product.currentStock} {product.unit}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Reorder at</Typography>
            <Typography variant="h6">{product.reorder_level}</Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">Cost / Sale</Typography>
            <Typography variant="h6">
              {product.cost_price} / {product.sale_price}
            </Typography>
          </Box>
          {low && <Chip color="warning" label="Low stock" />}
        </Box>
      </Paper>

      <MovementForm productId={product.id} onRecorded={load} />

      <Typography variant="h6" sx={{ mb: 1 }}>Movement history</Typography>

      {movements.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography color="text.secondary">
            No movements yet. Record the first one above.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((movement) => (
                <MovementRow key={movement.id} movement={movement} showProduct={false} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
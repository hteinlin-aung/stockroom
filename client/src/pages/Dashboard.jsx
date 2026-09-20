import { useEffect, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Alert, Box, Chip, CircularProgress, Grid, Link, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material"
import { api } from "../api.js"
import SummaryCard from "../components/SummaryCard.jsx"
import { MovementRow } from "../components/MovementRows.jsx"

function baht(amount) {
  return "฿" + Number(amount).toLocaleString()
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [lowStock, setLowStock] = useState([])
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    Promise.all([api.getSummary(), api.getLowStock(), api.getMovements()])
      .then(([summaryData, lowStockData, movementData]) => {
        setSummary(summaryData)
        setLowStock(lowStockData)
        setMovements(movementData.slice(0, 8))
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
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
      <Typography variant="h5" sx={{ mb: 2 }}>Dashboard</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard label="Products" value={summary.productCount} hint="in the catalogue" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard label="Units in stock" value={summary.totalUnits} hint="across all products" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard label="Stock value" value={baht(summary.stockValue)} hint="at cost price" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <SummaryCard
            label="Low stock"
            value={summary.lowStockCount}
            hint="at or below reorder level"
            highlight={summary.lowStockCount > 0}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" sx={{ mb: 1 }}>Needs reordering</Typography>

      {lowStock.length === 0 ? (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography color="text.secondary">
            Nothing is below its reorder level. Everything is stocked.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>SKU</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">In stock</TableCell>
                <TableCell align="right">Reorder at</TableCell>
                <TableCell align="right">Short by</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStock.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>
                    <Link component={RouterLink} to={`/products/${product.id}`} underline="hover">
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell align="right">
                    <Chip size="small" color="warning" label={product.currentStock} />
                  </TableCell>
                  <TableCell align="right">{product.reorder_level}</TableCell>
                  <TableCell align="right">
                    {product.reorder_level - product.currentStock}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Typography variant="h6" sx={{ mb: 1 }}>Recent activity</Typography>

      {movements.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography color="text.secondary">No stock movements recorded yet.</Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {movements.map((movement) => (
                <MovementRow key={movement.id} movement={movement} showProduct />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}
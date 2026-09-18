import { useEffect, useState } from "react"
import {
  Alert, Box, CircularProgress, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from "@mui/material"
import { api } from "../api.js"
import { MovementRow } from "../components/MovementRows.jsx"

export default function Movements() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api
      .getMovements()
      .then(setMovements)
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
      <Typography variant="h5" sx={{ mb: 2 }}>Movements</Typography>

      {movements.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
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
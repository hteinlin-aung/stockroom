import { Chip, TableCell, TableRow } from "@mui/material"

const LABELS = {
  in: { text: "IN", color: "success" },
  out: { text: "OUT", color: "error" },
  adjust: { text: "ADJUST", color: "default" },
}

export function MovementTypeChip({ type }) {
  const label = LABELS[type] || { text: type, color: "default" }
  return <Chip size="small" label={label.text} color={label.color} />
}

export function formatDate(iso) {
  return new Date(iso).toLocaleString()
}

export function MovementRow({ movement, showProduct }) {
  return (
    <TableRow hover>
      <TableCell>{formatDate(movement.created_at)}</TableCell>
      {showProduct && <TableCell>{movement.product_name}</TableCell>}
      <TableCell>
        <MovementTypeChip type={movement.type} />
      </TableCell>
      <TableCell align="right">
        {movement.type === "out" ? "-" : "+"}
        {movement.quantity}
      </TableCell>
      <TableCell>{movement.note || "—"}</TableCell>
    </TableRow>
  )
}
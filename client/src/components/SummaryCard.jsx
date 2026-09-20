import { Paper, Typography } from "@mui/material"

export default function SummaryCard({ label, value, hint, highlight }) {
  return (
    <Paper sx={{ p: 2.5, height: "100%" }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>

      <Typography
        variant="h4"
        sx={{ my: 0.5, color: highlight ? "warning.main" : "text.primary" }}
      >
        {value}
      </Typography>

      {hint && (
        <Typography variant="caption" color="text.secondary">
          {hint}
        </Typography>
      )}
    </Paper>
  )
}
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material"
import { Link } from "react-router-dom"

export default function NavBar() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          StockRoom
        </Typography>
        <Box sx={{ ml: 4, display: "flex", gap: 1 }}>
          <Button component={Link} to="/" color="inherit">
            Dashboard
          </Button>
          <Button component={Link} to="/products" color="inherit">
            Products
          </Button>
          <Button component={Link} to="/movements" color="inherit">
            Movements
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

import { Routes, Route } from "react-router-dom"
import { Box, Container } from "@mui/material"

import NavBar from "./components/NavBar.jsx"
import Dashboard from "./pages/Dashboard.jsx"
import Products from "./pages/Products.jsx"
import ProductDetail from "./pages/ProductDetail.jsx"
import Movements from "./pages/Movements.jsx"

export default function App() {
  return (
    <Box>
      <NavBar />
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/movements" element={<Movements />} />
        </Routes>
      </Container>
    </Box>
  )
}

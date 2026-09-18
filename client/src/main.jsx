import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import App from "./App.jsx"

const theme = createTheme({
  palette: {
    primary: { main: "#1f6feb" },
    background: { default: "#f6f7f9" },
  },
  shape: { borderRadius: 8 },
})

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)

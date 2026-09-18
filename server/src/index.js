import express from "express"
import cors from "cors"
import "dotenv/config"

import productsRouter from "./routes/products.js"
import movementsRouter from "./routes/movements.js"
import reportsRouter from "./routes/reports.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
  res.json({ ok: true })
})

app.use("/api/products", productsRouter)
app.use("/api/movements", movementsRouter)
app.use("/api/reports", reportsRouter)

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`listening on ${port}`)
})

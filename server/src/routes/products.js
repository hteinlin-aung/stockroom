import { Router } from "express"
import db from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  const products = db.prepare("SELECT * FROM products ORDER BY name").all()
  res.json(products)
})

export default router

import { Router } from "express"
import db from "../db.js"
import { currentStock } from "../lib/stock.js"

const router = Router()
const TYPES = ["in", "out", "adjust"]

//  19
router.get("/", (req, res) => {
  const { productId } = req.query

  let sql = `
    SELECT m.*, p.name AS product_name, p.sku AS product_sku
    FROM movements m
    JOIN products p ON p.id = m.product_id
  `
  const params = []

  if (productId) {
    sql += " WHERE m.product_id = ?"
    params.push(Number(productId))
  }

  sql += " ORDER BY m.created_at DESC, m.id DESC LIMIT 200"

  res.json(db.prepare(sql).all(...params))
})

//  16
router.post("/", (req, res) => {
  const { product_id, type, quantity, note } = req.body

  const product = db.prepare("SELECT id, name FROM products WHERE id = ?").get(Number(product_id))
  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  if (!TYPES.includes(type)) {
    return res.status(400).json({ error: 'type must be "in", "out" or "adjust"' })
  }

  const qty = Number(quantity)
  if (!Number.isInteger(qty) || qty <= 0) {
    return res.status(400).json({ error: "quantity must be a whole number greater than 0" })
  }

  if (type === "out") {
    const movements = db
      .prepare("SELECT type, quantity FROM movements WHERE product_id = ?")
      .all(product.id)
    const stock = currentStock(movements)

    if (qty > stock) {
      return res.status(409).json({
        error: `Cannot remove ${qty} — only ${stock} in stock for "${product.name}"`,
      })
    }
  }

  const result = db
    .prepare(
      `INSERT INTO movements (product_id, type, quantity, note, created_at)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(product.id, type, qty, note || null, new Date().toISOString())

  const created = db.prepare("SELECT * FROM movements WHERE id = ?").get(result.lastInsertRowid)
  res.status(201).json(created)
})

export default router

import { Router } from "express"
import db from "../db.js"
import { PRODUCTS_WITH_STOCK } from "../lib/queries.js"

const router = Router()

router.get("/", (req, res) => {
  const products = db.prepare(`${PRODUCTS_WITH_STOCK} ORDER BY p.name`).all()

  res.json(products)
})


router.get("/:id", (req, res) => {
  const id = Number(req.params.id)
  const product = db
    .prepare(`SELECT * FROM (${PRODUCTS_WITH_STOCK}) WHERE id = ?`)
    .get(id)

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  res.json(product)
})


router.post("/", (req, res) => {
  const { sku, name, category, unit, cost_price, sale_price, reorder_level } = req.body

  if (!sku || !name) {
    return res.status(400).json({ error: "sku and name are required" })
  }

  const taken = db.prepare("SELECT id FROM products WHERE sku = ?").get(sku)
  if (taken) {
    return res.status(409).json({ error: `SKU "${sku}" already exists` })
  }

  const result = db
    .prepare(
      `INSERT INTO products (sku, name, category, unit, cost_price, sale_price, reorder_level, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      sku,
      name,
      category || null,
      unit || "pcs",
      cost_price || 0,
      sale_price || 0,
      reorder_level || 0,
      new Date().toISOString()
    )

  const created = db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid)
  res.status(201).json(created)
})


router.put("/:id", (req, res) => {
  const id = Number(req.params.id)
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id)

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  const { sku, name, category, unit, cost_price, sale_price, reorder_level } = req.body

  if (!sku || !name) {
    return res.status(400).json({ error: "sku and name are required" })
  }

  const taken = db.prepare("SELECT id FROM products WHERE sku = ? AND id != ?").get(sku, id)
  if (taken) {
    return res.status(409).json({ error: `SKU "${sku}" belongs to another product` })
  }

  db.prepare(
    `UPDATE products
     SET sku = ?, name = ?, category = ?, unit = ?, cost_price = ?, sale_price = ?, reorder_level = ?
     WHERE id = ?`
  ).run(sku, name, category || null, unit || "pcs", cost_price || 0, sale_price || 0, reorder_level || 0, id)

  const updated = db.prepare("SELECT * FROM products WHERE id = ?").get(id)
  res.json(updated)
})


router.delete("/:id", (req, res) => {
  const id = Number(req.params.id)
  const product = db.prepare("SELECT * FROM products WHERE id = ?").get(id)

  if (!product) {
    return res.status(404).json({ error: "Product not found" })
  }

  const { count } = db
    .prepare("SELECT COUNT(*) AS count FROM movements WHERE product_id = ?")
    .get(id)

  if (count > 0) {
    return res.status(409).json({
      error: `Cannot delete "${product.name}": it has ${count} stock movement${count === 1 ? "" : "s"}.`,
    })
  }

  db.prepare("DELETE FROM products WHERE id = ?").run(id)
  res.status(204).end()
})

export default router

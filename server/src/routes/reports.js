import { Router } from "express"
import db from "../db.js"
import { PRODUCTS_WITH_STOCK } from "../lib/queries.js"

const router = Router()

//  23
router.get("/summary", (req, res) => {
  const summary = db
    .prepare(
      `SELECT
         COUNT(*)                                                       AS productCount,
         COALESCE(SUM(currentStock), 0)                                 AS totalUnits,
         COALESCE(SUM(currentStock * cost_price), 0)                    AS stockValue,
         SUM(CASE WHEN currentStock <= reorder_level THEN 1 ELSE 0 END) AS lowStockCount
       FROM (${PRODUCTS_WITH_STOCK})`
    )
    .get()

  res.json(summary)
})

//  24
router.get("/low-stock", (req, res) => {
  const products = db
    .prepare(
      `${PRODUCTS_WITH_STOCK}
       HAVING currentStock <= p.reorder_level
       ORDER BY currentStock ASC, p.name`
    )
    .all()

  res.json(products)
})

export default router
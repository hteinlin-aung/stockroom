// Every product, with its stock worked out from the movement ledger.
// Used by the products list, the product detail, and the reports.
export const PRODUCTS_WITH_STOCK = `
  SELECT
    p.*,
    COALESCE(SUM(CASE WHEN m.type = 'out' THEN -m.quantity ELSE m.quantity END), 0) AS currentStock
  FROM products p
  LEFT JOIN movements m ON m.product_id = p.id
  GROUP BY p.id
`

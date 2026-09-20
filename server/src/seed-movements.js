import db from "./db.js"

// A realistic few weeks of warehouse activity, so the app has something
// to show. Quantities are chosen so three products end up below their
// reorder level.
const history = [
  ["CBL-1001", "in",     120, "Delivery — PO #2041",            21],
  ["CBL-1001", "out",     45, "Sold — bulk order, TechMart",    14],
  ["CBL-1001", "out",     30, "Sold",                            5],

  ["CBL-1002", "in",      80, "Delivery — PO #2041",            21],
  ["CBL-1002", "out",     22, "Sold",                            9],

  ["CBL-1050", "in",     100, "Delivery — PO #2044",            18],
  ["CBL-1050", "out",     35, "Sold — bulk order, TechMart",    12],
  ["CBL-1050", "out",     28, "Sold",                            4],

  ["PER-1010", "in",      40, "Delivery — PO #2044",            18],
  ["PER-1010", "out",     12, "Sold",                           11],
  ["PER-1010", "out",      9, "Sold",                            3],

  ["PER-1011", "in",      15, "Delivery — PO #2050",            15],
  ["PER-1011", "out",      6, "Sold",                            6],

  ["PER-1060", "in",      24, "Delivery — PO #2050",            15],
  ["PER-1060", "out",      8, "Sold",                           10],
  ["PER-1060", "out",     11, "Sold — office fit-out",           2],

  ["DSP-1020", "in",      18, "Delivery — PO #2052",            13],
  ["DSP-1020", "out",      4, "Sold — office fit-out",           2],

  ["ACC-1021", "in",      30, "Delivery — PO #2052",            13],
  ["ACC-1021", "out",     12, "Sold",                            8],
  ["ACC-1021", "out",      3, "Damaged in transit — written off", 7],

  ["ACC-1030", "in",      25, "Delivery — PO #2055",            10],
  ["ACC-1030", "out",     14, "Sold",                            6],
  ["ACC-1030", "out",      3, "Sold",                            1],

  ["ACC-1070", "in",      40, "Delivery — PO #2055",            10],
  ["ACC-1070", "out",     16, "Sold",                            3],

  ["PWR-1040", "in",      50, "Delivery — PO #2058",             8],
  ["PWR-1040", "out",     20, "Sold — bulk order, TechMart",     5],
  ["PWR-1040", "out",     22, "Sold",                            1],

  ["PWR-1041", "in",      35, "Delivery — PO #2058",             8],
  ["PWR-1041", "out",     15, "Sold",                            4],
  ["PWR-1041", "adjust",   2, "Stock count — 2 more than expected", 1],
]

const findProduct = db.prepare("SELECT id FROM products WHERE sku = ?")
const insert = db.prepare(
  `INSERT INTO movements (product_id, type, quantity, note, created_at)
   VALUES (?, ?, ?, ?, ?)`
)

db.exec("DELETE FROM movements")

const DAY = 24 * 60 * 60 * 1000

history.forEach(([sku, type, quantity, note, daysAgo]) => {
  const product = findProduct.get(sku)
  if (!product) {
    console.log(`skipped ${sku} — no such product`)
    return
  }
  const when = new Date(Date.now() - daysAgo * DAY).toISOString()
  insert.run(product.id, type, quantity, note, when)
})

console.log(`seeded ${history.length} movements`)

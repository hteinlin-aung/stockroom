import db from "./db.js"

const products = [
  { sku: "CBL-1001", name: "USB-C Cable 1m",      category: "Cables",      unit: "pcs", cost: 45,   sale: 120,  reorder: 20 },
  { sku: "CBL-1002", name: "USB-C Cable 2m",      category: "Cables",      unit: "pcs", cost: 60,   sale: 160,  reorder: 15 },
  { sku: "CBL-1050", name: "HDMI Cable 1.5m",     category: "Cables",      unit: "pcs", cost: 70,   sale: 180,  reorder: 20 },
  { sku: "PER-1010", name: "Wireless Mouse",      category: "Peripherals", unit: "pcs", cost: 220,  sale: 450,  reorder: 10 },
  { sku: "PER-1011", name: "Mechanical Keyboard", category: "Peripherals", unit: "pcs", cost: 890,  sale: 1590, reorder: 5  },
  { sku: "PER-1060", name: "Webcam 1080p",        category: "Peripherals", unit: "pcs", cost: 610,  sale: 1190, reorder: 6  },
  { sku: "DSP-1020", name: '27" Monitor',         category: "Displays",    unit: "pcs", cost: 4200, sale: 6900, reorder: 3  },
  { sku: "ACC-1021", name: "Monitor Stand",       category: "Accessories", unit: "pcs", cost: 320,  sale: 690,  reorder: 8  },
  { sku: "ACC-1030", name: 'Laptop Sleeve 14"',   category: "Accessories", unit: "pcs", cost: 150,  sale: 390,  reorder: 12 },
  { sku: "ACC-1070", name: "Desk Mat",            category: "Accessories", unit: "pcs", cost: 180,  sale: 420,  reorder: 10 },
  { sku: "PWR-1040", name: "65W USB-C Charger",   category: "Power",       unit: "pcs", cost: 380,  sale: 750,  reorder: 10 },
  { sku: "PWR-1041", name: "Power Bank 10000mAh", category: "Power",       unit: "pcs", cost: 420,  sale: 890,  reorder: 8  },
]

db.exec("DELETE FROM movements")
db.exec("DELETE FROM products")

const insert = db.prepare(`
  INSERT INTO products (sku, name, category, unit, cost_price, sale_price, reorder_level, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`)

const now = new Date().toISOString()

products.forEach((p) => {
  insert.run(p.sku, p.name, p.category, p.unit, p.cost, p.sale, p.reorder, now)
})

console.log(`seeded ${products.length} products`)
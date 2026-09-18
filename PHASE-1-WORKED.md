# Phase 1 — Worked Answers (Tasks 1, 2, 3)

How to use this: **try the task first.** When you're done, or stuck for more
than 30 minutes, come here. Compare your plan to mine before you compare your
code — if your plan was right and only the code was wrong, that's a much
smaller problem than it feels like.

Every line below was run on your Mac. The output at the end of each task is
real, not predicted.

Type these into the project yourself. Don't paste. The typing is where the
pattern goes in.

---

## Task 1 — `server/src/db.js`

### The plan, in English

1. Open the database file (better-sqlite3 creates it if it isn't there yet).
2. Turn foreign keys on — SQLite has them off by default.
3. Read `schema.sql` and run it, so the tables exist on first run.
4. Export the connection so route files can use it.

### The code

```js
import Database from "better-sqlite3"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import "dotenv/config"

const here = path.dirname(fileURLToPath(import.meta.url))
const dbFile = process.env.DB_FILE || path.join(here, "../stockroom.db")

const db = new Database(dbFile)
db.pragma("foreign_keys = ON")

const schema = fs.readFileSync(path.join(here, "schema.sql"), "utf8")
db.exec(schema)

export default db
```

### The parts that aren't obvious

**`fileURLToPath(import.meta.url)` — why this ugly line exists.**
You need the folder *this file* lives in, so you can find `schema.sql` next to
it. In older CommonJS Node you'd write `__dirname`. ES modules (which you're
using, because `package.json` says `"type": "module"`) don't have `__dirname`,
so this is the replacement. `import.meta.url` gives you the file's URL,
`fileURLToPath` turns it into a normal path, `path.dirname` strips the filename.

Copy the line, understand what it produces, move on. Everyone looks it up.

**Why not just `fs.readFileSync("./schema.sql")`?**
Because `./` means "wherever the terminal was when you ran node", not "next to
this file". Run `npm run dev` from a different folder and it breaks. This is
the single most common path bug in Node, and it's the same one that bit you in
the Library Checkout project with `./data/books.json`.

**`db.pragma("foreign_keys = ON")`.**
SQLite ignores foreign keys unless you ask. Without this, `movements` could
point at a `product_id` that doesn't exist and SQLite wouldn't complain. One
line now saves a confusing bug in Phase 5.

**`db.exec(schema)` is safe to run every time** because `schema.sql` uses
`CREATE TABLE IF NOT EXISTS`. Starting the server doesn't wipe your data.

**Why `export default db` and not a `connect()` function?**
Node caches modules. The first file to import this runs it; everyone after
gets the same object back. So there's exactly one connection for the whole
app, which is what you want. You get a singleton for free.

---

## Task 2 — `server/src/seed.js`

### The plan, in English

1. Make an array of sample products.
2. Empty both tables, so running it twice doesn't pile up duplicates.
3. Prepare one INSERT statement and run it once per product.
4. Print how many went in, so you know it worked.

### The code

```js
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
```

Add this to `server/package.json` scripts if it isn't there:
`"seed": "node src/seed.js"`

### The parts that aren't obvious

**`db.prepare(...)` once, `.run(...)` many times.**
Preparing a statement means SQLite parses the SQL and works out a plan *once*.
Then each `.run()` just fills in the blanks. If you put `db.prepare()` inside
the loop you'd re-parse the same SQL twelve times. With twelve rows nobody
notices; with fifty thousand it matters, and doing it right costs nothing.

**The `?` placeholders — this is the important one.**
Never build SQL by joining strings:

```js
// NEVER do this
db.exec(`INSERT INTO products (name) VALUES ('${p.name}')`)
```

A product named `O'Brien` breaks it — the apostrophe closes the string early.
And a product named `'); DROP TABLE products; --` does something much worse.
That's **SQL injection**, and it's the number one thing a reviewer looks for
when someone writes raw SQL. `?` placeholders make the value *always* a value,
never code.

Know this well enough to say it out loud. "I used parameterised queries so
user input can never be interpreted as SQL" is a strong interview sentence,
and you'll have written it yourself.

**Movements get deleted first, products second.** Movements point at products
via a foreign key. Delete the products first and SQLite rejects it (because
you turned foreign keys on in Task 1). Children before parents — this ordering
comes up constantly.

**Why 12 realistic products and not "Product 1, Product 2".**
This data ends up in the screenshot at the top of your README. Real product
names make the app look like a real app. It costs you five minutes.

### Real output from your machine

```
=== run seed ===
seeded 12 products

=== run seed AGAIN (must not duplicate or crash) ===
seeded 12 products

count: 12
```

Re-running is safe. That matters — you'll re-seed a lot while building.

**One thing that will confuse you later:** after re-seeding, the ids don't
start at 1. `DELETE FROM` removes rows but doesn't reset `AUTOINCREMENT`, so
my second run produced ids starting at 19. That is normal and harmless. Never
assume "the first product has id 1" anywhere in your code.

---

## Task 3 — `GET /api/products`

### The plan, in English

1. Import the database into the products route file.
2. Add a GET route at `/`.
3. Select every product, ordered by name.
4. Send it back as JSON.

### The code

`server/src/routes/products.js`:

```js
import { Router } from "express"
import db from "../db.js"

const router = Router()

router.get("/", (req, res) => {
  const products = db.prepare("SELECT * FROM products ORDER BY name").all()
  res.json(products)
})

export default router
```

### The parts that aren't obvious

**The path is `/`, not `/products`.** In `index.js` I already wrote
`app.use("/api/products", productsRouter)`. That prefix is applied to
everything in this file, so `/` here means `/api/products`. Write `/products`
and your URL becomes `/api/products/products`. This catches everyone once.

**`.all()` vs `.get()` vs `.run()`** — better-sqlite3's three methods:

| method | returns | use it for |
|---|---|---|
| `.all()` | array of rows | SELECT expecting many |
| `.get()` | one row, or `undefined` | SELECT expecting one |
| `.run()` | info about the change | INSERT / UPDATE / DELETE |

`.get()` returning `undefined` is how you'll detect "no product with that id"
and send a 404 in Task 4.

**`ORDER BY name`.** Without it SQLite returns rows in whatever order it likes.
It usually looks sorted by id, so it *looks* fine — until one day it isn't.
If you want an order, say so.

**`SELECT *` is fine here** because you want every column. Once you add
`currentStock` in Phase 5 you'll name columns explicitly. Don't optimise now.

### Real output from your machine

```
GET /api/products  ->  HTTP 200
returned 12 products

first row: {
  "id": 19,
  "sku": "DSP-1020",
  "name": "27\" Monitor",
  "category": "Displays",
  "unit": "pcs",
  "cost_price": 4200,
  "sale_price": 6900,
  "reorder_level": 3,
  "created_at": "2026-09-18T10:23:14.498Z"
}
```

Note the column names come back as `cost_price`, not `costPrice` — SQL uses
snake_case, JavaScript uses camelCase. You have a choice: convert them in the
API, or just use `product.cost_price` in React. **Pick one and be consistent.**
The simplest option is to leave them as they are; it's one less layer to
explain. Whatever you pick, write it in the README.

---

## Commit these

```bash
cd ~/Desktop/Claude_Cowork/StockRoom
git add .
git commit -m "add database connection, seed script and products list endpoint"
```

If you haven't run `git init` yet, do that first, and **check `.gitignore` is
working before your first commit**:

```bash
git status --short
```

You must NOT see `node_modules`, `.env`, `stockroom.db`, or `client/dist` in
that list. If you do, stop and tell me. Committing `.env` is the exact mistake
sitting in the NKPOS repo right now — don't repeat it in the repo you're
showing employers.

---

## Now Tasks 4–7 are yours

These are the same shape as Task 3. You now have a complete worked example of
every piece you need — a route, a prepared statement, a response. Tasks 4 to 7
are variations on it:

| Task | Route | The new thing to work out |
|---|---|---|
| 4 | `GET /api/products/:id` | reading `req.params.id`; `.get()` returning `undefined` → 404 |
| 5 | `POST /api/products` | reading `req.body`; validating; 400 vs 201; duplicate SKU |
| 6 | `PUT /api/products/:id` | 404 if missing, then update |
| 7 | `DELETE /api/products/:id` | count movements first; 409 with a clear message if any exist |

**Write the plan in English at the top of each one before you write code.**

Task 7 is the interesting one — it's the first time your app refuses to do
what the user asked. Getting the message right ("Cannot delete: this product
has 4 stock movements") is the difference between an app and an exercise.

Send me all four when they're done and I'll run them against the same kind of
evidence you've seen here — real requests, real status codes, real output.

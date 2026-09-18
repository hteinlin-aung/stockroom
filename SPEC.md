# StockRoom — Inventory & Stock Manager

## What it is

A small inventory system for a shop or warehouse. You add products, record
stock coming in and going out, and the app tells you what you have and what
is running low.

## Why this project

You worked on warehouse management and warehouse transfer modules at NK
Software House. That means in an interview you can say *"I've built this kind
of module for a real client, and I wanted my own version I could show."*
Almost no junior candidate can say that. It is the reason this project was
chosen over a todo app.

## The one design decision that matters

**Stock level is never stored. It is always calculated.**

The obvious design is a `quantity` column on the product that you add to and
subtract from. Almost every beginner project does this. It is also what real
inventory systems deliberately avoid, because:

- if two updates happen at once, the number silently goes wrong
- when the number is wrong, there is no way to find out why
- you cannot answer "what did stock look like last Tuesday?"

Instead, every change is recorded as a **movement** — a row saying
*"+50 of product 3 on the 4th"* or *"-12 of product 3 on the 6th"*. Current
stock is the sum of those rows.

```
movements for product 3:   +50   -12   -8   +20
current stock            = 50
```

This is called a **ledger**, and it is the same idea as a bank statement:
the balance is not stored, it is the sum of the transactions.

**Say this in your interview.** "I chose to derive stock from a movement
ledger rather than store a mutable quantity, so every change is auditable"
is the kind of sentence that separates a junior who copied a tutorial from
one who thought about the problem.

(It also happens to be a `reduce` over an array — the thing you just spent
two weeks drilling.)

---

## Features

### v1 — what you are building

**Products**
- List all products in a table
- Search by name or SKU
- Filter by category
- Add, edit, delete a product
- A product cannot be deleted if it has movements (you would lose history)

**Stock movements**
- Record stock IN (a delivery arrived)
- Record stock OUT (sold or issued)
- Record an ADJUSTMENT (stock count correction, damage, loss)
- Every movement has a note field so the reason is recorded
- See the full movement history for one product
- See a log of all recent movements

**Dashboard**
- How many products there are
- Total value of stock held (quantity x cost price)
- How many products are at or below their reorder level
- A list of those low-stock products
- The last 10 movements

**Low stock**
- Each product has a reorder level
- Any product at or below it is flagged in the table and listed on the dashboard

### Not in v1 — deliberately

Leave these out. They double the size and add nothing a reviewer cares about.

- User accounts and login
- Suppliers and purchase orders
- Barcode scanning
- Multi-warehouse
- Roles and permissions

Put them in the README under "Possible next steps" instead. Naming what you
chose *not* to build reads as judgement, not laziness.

---

## Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React 19 + Vite | What you already use at work and in your portfolio |
| UI | MUI | You know it from NKPOS — no time lost learning a new library |
| Routing | React Router | Standard, and this app needs real pages |
| Backend | Node + Express | Smallest honest backend; the job ads ask for Node |
| Database | SQLite (better-sqlite3) | A single file, nothing to install, deploys anywhere |
| SQL | Written by hand, no ORM | You learn what is actually happening, and you can explain it |

**Why no ORM:** a reviewer asking "how does your app talk to the database?"
gets a much better answer from someone who wrote the SQL than someone who
called `.findMany()`. You can add Prisma to a later project once you know
what it is hiding.

---

## Data model

Two tables. That is all this needs.

```sql
CREATE TABLE products (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  sku           TEXT    NOT NULL UNIQUE,
  name          TEXT    NOT NULL,
  category      TEXT,
  unit          TEXT    NOT NULL DEFAULT 'pcs',
  cost_price    REAL    NOT NULL DEFAULT 0,
  sale_price    REAL    NOT NULL DEFAULT 0,
  reorder_level INTEGER NOT NULL DEFAULT 0,
  created_at    TEXT    NOT NULL
);

CREATE TABLE movements (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  type       TEXT    NOT NULL,   -- 'in' | 'out' | 'adjust'
  quantity   INTEGER NOT NULL,   -- always positive; `type` decides the direction
  note       TEXT,
  created_at TEXT    NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);
```

**Note on `quantity`:** always store a positive number and let `type` decide
whether it adds or subtracts. Storing negative numbers works too, but then
"how many did we sell this month" needs you to remember which sign means what.
Positive quantity + a type column is clearer to read six months later.

**`adjust` is different:** for `in` and `out` the quantity is a change. For
`adjust` treat the quantity as a change too (positive adjust = found extra
stock, negative-effect adjust = damage). Keep it simple: `adjust` behaves
like `in` if the note says found, like `out` if damaged — no. **Decide one
rule and write it in the README.** The simplest rule: `adjust` adds, and to
subtract you record an `out` with the note "damaged". Fewer cases to handle.

---

## API

```
GET    /api/health                  is the server up

GET    /api/products                all products, each with currentStock
POST   /api/products                create one
GET    /api/products/:id            one product + its movements
PUT    /api/products/:id            update one
DELETE /api/products/:id            delete (refuse if it has movements)

GET    /api/movements               recent movements, newest first
                                    optional ?productId=3
POST   /api/movements               record a movement

GET    /api/reports/summary         { productCount, stockValue, lowStockCount }
GET    /api/reports/low-stock       products at or below reorder_level
```

**Status codes to use** — reviewers do notice this:

| Situation | Code |
|---|---|
| Worked | 200 |
| Created something | 201 |
| Bad input (missing name, quantity is 0) | 400 |
| Asked for an id that doesn't exist | 404 |
| Tried to delete a product that has movements | 409 |
| Your code crashed | 500 |

---

## Pages

| Route | Page | What's on it |
|---|---|---|
| `/` | Dashboard | Summary cards, low-stock list, recent movements |
| `/products` | Products | Table, search, category filter, add button |
| `/products/:id` | Product detail | Product info, record-movement form, movement history |
| `/movements` | Movements | Full log with filters |

---

## Definition of done

Not "the code works." Done means:

- [ ] All four pages work with real data from the database
- [ ] Every form shows an error when the server rejects it
- [ ] Every list shows a loading state and an empty state
- [ ] Deleting a product with movements is refused, and the UI explains why
- [ ] README has: a screenshot, a live link, the problem, the stack, the
      ledger decision, how to run it locally, and what you'd do next
- [ ] Deployed and reachable from a link
- [ ] No secrets committed — `.env` is gitignored from the first commit

# StockRoom

Inventory and stock management for a small shop or warehouse — track products,
record every stock movement, and see what needs reordering.

**Live demo:** [link]
*(The API is on a free tier and sleeps after 15 minutes of inactivity. The first
request can take up to a minute to wake it.)*

![Dashboard](docs/screenshot-dashboard.png)

## The problem

Small shops and warehouses usually track stock in a spreadsheet, or not at all.
It works until it doesn't: two people edit the same file, someone forgets to
write down a sale, and the number on the screen stops matching the number on the
shelf. When that happens there is no way to find out where it went wrong — the
spreadsheet only shows the current figure, not how it got there. Things quietly
run out, and nobody notices until a customer asks for them.

During internship at NK Software House, I worked on the Warehouse modules and Reports modules of a POS system for a real client. That work is what made me want my own version — something small enough to finish and explain end to end, where I could make the design decisions myself instead of following an existing codebase.

StockRoom is that: a single-user inventory tool for a shop or warehouse holding
a few hundred products. You add products, record every movement of stock in and
out, and it tells you what you have and what needs reordering.

## Features

- **Products** — catalogue with SKU, category, unit, cost and sale price, and a
  per-product reorder level
- **Stock movements** — record stock in, stock out, and adjustments, each with a
  note, forming a full audit trail
- **Derived stock** — current stock is calculated from the movement ledger, never
  stored (see below)
- **Negative stock prevention** — the API refuses a stock-out larger than what is
  actually in stock, and says how much is available
- **Low stock** — anything at or below its reorder level is flagged in the table
  and listed on the dashboard
- **Dashboard** — product count, total units, stock value at cost, low-stock
  count, a reorder list and recent activity
- **Search and filter** — by name or SKU, by category, or low stock only

## Tech

React 19 · Vite · MUI · React Router · Node · Express · SQLite
**Frontend** React 19 · Vite · Material UI · React Router
**Backend** Node · Express · SQLite (better-sqlite3), hand-written SQL, no ORM


## Key decision: stock is calculated, not stored

The obvious way to track stock is a `quantity` column on the product that you
add to and subtract from. I deliberately did not do that.

Instead, every change is stored as its own row in a `movements` table — a
delivery of 120, a sale of 45, a damaged item written off — and the current
stock is the sum of those rows. It works like a bank statement: the balance is
not stored anywhere, it is the total of the transactions.

**What this buys me.** Every number is explainable. If a product shows 38 in
stock, I can show exactly which movements produced that figure and when. Two
updates arriving at the same time cannot overwrite each other, because nothing
is being overwritten — rows are only ever added. And because each movement is
timestamped, stock at any past date is answerable without storing history
separately.

**What it costs.** Reading stock is no longer reading one column. Every product
query needs a `LEFT JOIN` onto movements with a `GROUP BY`, which is more work
for the database and more SQL to get right.

**Where it lives.** For list views the calculation runs in SQL (`lib/queries.js`)
so twelve products take one query instead of thirteen — avoiding the N+1 query
problem. The same rule also exists as a pure function in `lib/stock.js`, which
the write path uses to check that a stock-out would not push a product negative
before accepting it. Having the rule in two places is a real trade-off; I kept
both because the read path and the write path have genuinely different needs,
and the SQL version is shared by every read rather than copy-pasted.


## Running it locally

```bash
# server
cd server
npm install
cp .env.example .env
npm run seed        # creates the database and loads sample products
npm run dev         # http://localhost:4000

# client — in a second terminal
cd client
npm install
npm run dev         # http://localhost:5173
```

## Project structure

```
server/
  src/
    index.js        Express app and route mounting
    db.js           opens SQLite, applies schema.sql
    schema.sql      the two tables
    seed.js         sample data
    lib/stock.js    current-stock calculation
    routes/         products, movements, reports
client/
  src/
    api.js          fetch helper used by every page
    pages/          Dashboard, Products, ProductDetail, Movements
    components/     shared UI
```

## What I'd do next

- **Suppliers and purchase orders** — turn the reorder list into an actual order
- **User accounts** — right now anyone with the link can change stock
- **Tests** — the stock calculation and the API validation are the obvious first
  targets
- **CSV export** — the reorder list is the report people actually want to email
- **Multi-warehouse** — movements would gain a location, and stock becomes
  per-location

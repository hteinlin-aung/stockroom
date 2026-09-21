# StockRoom

Inventory and stock management for a small shop or warehouse — track products,
record every stock movement, and see what needs reordering.

**Live demo:** [https://stockroom-hteinlin.netlify.app]
*(The API is on a free tier and sleeps after 15 minutes of inactivity. The first
request can take up to a minute to wake it.)*

![Dashboard](docs/screenshot-dashboard.png)

## About

During internship at NK Software House, I worked on the Warehouse modules and Reports modules of a POS system for a real client. That work is what made me want my own version — something small enough to finish and explain end to end, where I could make the design decisions myself instead of following an existing codebase.

StockRoom is: a single-user inventory tool for a shop or warehouse holding
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

Stock is calculated from a movements table, where every delivery, sale, or write-off is stored as a separate row. 
The current stock is simply the sum of these movements, similar to a bank statement. This makes every stock figure 
traceable, prevents concurrent updates from overwriting each other, and allows stock at any past date to be calculated.
The trade-off is that reading stock requires a LEFT JOIN and GROUP BY. To avoid N+1 queries, list views calculate stock 
in SQL (lib/queries.js) with one query for all products. The same calculation is also kept as a pure function 
in lib/stock.js for validating stock-outs before they are accepted.


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

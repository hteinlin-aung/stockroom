# StockRoom

> **TODO — fill this in yourself, in your own words.**
> This is the most-read file in the whole repo. A reviewer spends about
> thirty seconds here and decides whether to look at your code at all.
> Replace every bracketed line below. Delete this quote block when done.

[One sentence: what this is and who it's for.]

**Live demo:** [link]

![Dashboard](docs/screenshot-dashboard.png)

## The problem

[2-3 sentences. What goes wrong without this tool? Mention that you worked on
warehouse management modules during your internship and wanted your own
version — that context is the reason this project is more interesting than a
generic CRUD app.]

## Features

- [ ] Product catalogue with SKU, category, cost and sale price
- [ ] Stock movements in / out / adjustment, each with a note
- [ ] Current stock derived from the movement ledger
- [ ] Low-stock flagging against a per-product reorder level
- [ ] Dashboard: stock value, low-stock list, recent activity
- [ ] Search and filter

## Tech

React 19 · Vite · MUI · React Router · Node · Express · SQLite

## Key decision: stock is calculated, not stored

[Explain the ledger in your own words — why you didn't put a `quantity`
column on the product and add/subtract from it. This paragraph is the one a
senior engineer will actually read. Say what you gained (an audit trail, no
lost updates) and what it cost (a join or a sub-query on every product list).]

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

[3-4 bullets. Suppliers and purchase orders, user accounts, CSV export,
multi-warehouse, tests. Saying what you deliberately left out of v1 reads as
judgement — it shows you scoped the work rather than ran out of steam.]

# Build Order — StockRoom

26 tasks, in the order to write them. **One task = one commit.**

Why one commit per task: a reviewer looking at your repo sees 26 commits over
six weeks with messages like "add product delete endpoint" and "handle empty
product list". That reads as someone building something. Three commits saying
"update" reads as someone pasting a finished folder in.

**Rule for every task below: write the plan in English first.** Same habit as
the drills. If you cannot say the steps in words, the code will not come.

**Where to stop and ask me:** if you are stuck for more than 30 minutes on one
task, send me the task number and your code. Do not push through for three
hours — that is how the project dies.

---

## Which file does each task go in?

Two kinds of file in this project:

- **EDIT** — the file is already there with a `// TODO` comment inside.
  Delete the TODO comment and write your code in its place.
- **CREATE** — the file does not exist yet. You make it yourself.
  (In VS Code: right-click the folder → New File.)

Nothing is missing from the scaffold. A file being absent is intentional —
creating files is part of building an app, so I left the ones that belong to
a specific task for you to make.

| Task | File | EDIT or CREATE |
|---|---|---|
| 1 | `server/src/db.js` | **EDIT** — replace the TODO |
| 2 | `server/src/seed.js` | **CREATE** |
| 3 | `server/src/routes/products.js` | **EDIT** — replace the TODO |
| 4-7 | `server/src/routes/products.js` | EDIT — keep adding routes to the same file |
| 8 | `client/src/api.js` | **EDIT** — replace the TODO |
| 9-11 | `client/src/pages/Products.jsx` | **EDIT** — replace the placeholder |
| 12-14 | `client/src/components/ProductDialog.jsx` | **CREATE** |
| 15 | `client/src/components/ConfirmDialog.jsx` | **CREATE** |
| 16 | `server/src/routes/movements.js` | **EDIT** — replace the TODO |
| 17 | `server/src/lib/stock.js` | **EDIT** — replace the TODO |
| 18 | `server/src/routes/products.js` | EDIT — update the GET you wrote in Task 3 |
| 19 | `server/src/routes/movements.js` | EDIT — add the GET |
| 19b | `client/src/pages/Movements.jsx` | **EDIT** — replace the placeholder |
| 20 | `client/src/pages/ProductDetail.jsx` | **EDIT** — replace the placeholder |
| 21 | `client/src/components/MovementForm.jsx` | **CREATE** |
| 22 | `client/src/pages/Products.jsx` | EDIT |
| 23-24 | `server/src/routes/reports.js` | **EDIT** — replace the TODO |
| 25 | `client/src/pages/Dashboard.jsx` | **EDIT** — replace the placeholder |
| 25b | `client/src/components/SummaryCard.jsx` | **CREATE** |
| 26 | `client/src/pages/Products.jsx` | EDIT |
| — | `README.md` | EDIT — fill in every bracketed line, in your own words |

### What the scaffold gave you right now

```
server/src/
  index.js            done - Express app, wired up, don't change it yet
  schema.sql          done - the two tables
  db.js               TODO  <- Task 1
  lib/stock.js        TODO  <- Task 17
  routes/
    products.js       TODO  <- Tasks 3-7, 18
    movements.js      TODO  <- Tasks 16, 19
    reports.js        TODO  <- Tasks 23-24
  (seed.js)           you create this in Task 2

client/src/
  main.jsx            done - React root, MUI theme
  App.jsx             done - routes
  components/
    NavBar.jsx        done
  api.js              TODO  <- Task 8
  pages/
    Dashboard.jsx     placeholder <- Task 25
    Products.jsx      placeholder <- Tasks 9-15, 22, 26
    ProductDetail.jsx placeholder <- Tasks 20-21
    Movements.jsx     placeholder <- Task 19b
```

**`npm run seed` is already set up** in `server/package.json` and points at
`src/seed.js`. It will fail with "Cannot find module" until you create that
file in Task 2. That is expected, not a broken scaffold.

---

## Phase 0 — Setup · DONE (I did this)

Everything here is scaffolding, not logic:

- Folder structure, `client/` and `server/`
- `package.json` for both, with the right dependencies listed
- Vite config, ESLint config, `.gitignore`
- A minimal Express app that starts and answers `/api/health`
- `schema.sql` with the two tables from SPEC.md
- Empty route files and empty page components with TODO comments
- React Router set up with the four routes pointing at empty pages
- MUI theme provider wired up

**Your first job:** get it running.

```bash
cd server && npm install && npm run dev     # should print "listening on 4000"
cd client && npm install && npm run dev     # should open a page with a nav bar
```

Open `http://localhost:4000/api/health` — you should see `{"ok":true}`.
Commit nothing yet; this is my code, and it's already in the first commit.

---

## Phase 1 — Database and the first real endpoint

**Task 1 — `server/src/db.js`**
Open the SQLite file and run `schema.sql` against it so the tables exist.
*Plan first: where does the file live? what happens if the tables already
exist? (hint: `CREATE TABLE IF NOT EXISTS`)*

**Task 2 — `server/src/seed.js`**
A script that inserts about 12 sample products so you have something to look
at. Run it with `npm run seed`. Use realistic data — shop or warehouse stock,
not "Product 1, Product 2". A reviewer will see this data in your screenshot.

**Task 3 — `GET /api/products`**
Return every row from `products`. No stock calculation yet. Test it in the
browser before you write any React.
> **Commit here.** You now have a working backend endpoint.

---

## Phase 2 — Products CRUD, backend only

Do all of these before touching React. Test each one with your browser or
with `curl`. Finishing the backend first means that when the UI misbehaves
later, you already know the API is fine.

**Task 4 — `GET /api/products/:id`** — one product, or 404 if there is no
such id.

**Task 5 — `POST /api/products`** — create one. Validate: name and sku are
required, sku must not already exist. Return 400 with a message if not, 201
with the new product if yes.

**Task 6 — `PUT /api/products/:id`** — update. 404 if it does not exist.

**Task 7 — `DELETE /api/products/:id`** — delete, but **first check whether
it has movements**. If it does, return 409 and a message explaining why.
*This is the first place your app says no to the user. Get the message right.*
> **Commit after each task.** Four commits in this phase.

---

## Phase 3 — Frontend, reading only

**Task 8 — `client/src/api.js`**
One small helper that does `fetch`, checks whether the response was ok, and
throws a useful error if not. Every page uses this — write it once, well.
*Plan first: what should it do when the server returns 400 with a message?*

**Task 9 — Products page, table only**
Fetch on mount, show the products in an MUI table. No add, no edit yet.

**Task 10 — Loading and error states**
While it is fetching, show a spinner. If the fetch failed, show the error.
*This is the task most people skip. Do not skip it — a page that shows a
spinner and handles failure is the difference between a demo and an app.*

**Task 11 — Empty state**
If there are no products, say so, with a "add your first product" message.
Not a blank screen.
> Four commits.

---

## Phase 4 — Frontend, writing

**Task 12 — Add product dialog** — an MUI dialog with the form, posts to the
API, refreshes the table on success.

**Task 13 — Show server errors in the form** — when the API returns 400
("SKU already exists"), the user must see it. Not a blank failure.

**Task 14 — Edit product** — same dialog, filled in, PUT instead of POST.

**Task 15 — Delete with confirm** — confirm dialog first, and when the server
returns 409, show that message instead of pretending it worked.
> Four commits.

---

## Phase 5 — Movements · the heart of the app

This is the part that makes it a real inventory system rather than a CRUD
table. Take your time here.

**Task 16 — `POST /api/movements`**
Validate: product must exist, quantity must be a positive number, type must
be one of the three. Insert the row.

**Task 17 — The stock calculation**
A function that takes a product's movements and returns the current stock.
*This is a `reduce`. `in` and `adjust` add, `out` subtracts.*
Write it as its own small function in its own file so you can test it alone.

**Task 18 — `GET /api/products` now returns `currentStock`**
Join or sub-query the movements so each product comes back with its stock.
*Plan first: do you calculate in SQL or in JavaScript? Either is fine —
pick one and be able to say why.*

**Task 19 — `GET /api/movements`** — recent first, optional `?productId=`.

**Task 20 — Product detail page** — product info at the top, movement history
table below.

**Task 21 — Record movement form** — on the product detail page. Type, quantity,
note. On success the history and the stock number both update.

**Task 22 — Show stock in the products table** — a column, and make low stock
visually obvious (red chip, warning icon — something you can see in a
screenshot).
> Seven commits. This phase is the project.

---

## Phase 6 — Dashboard and reports

**Task 23 — `GET /api/reports/summary`** — product count, total stock value
(quantity x cost price), low stock count.

**Task 24 — `GET /api/reports/low-stock`** — products at or below reorder level.

**Task 25 — Dashboard page** — summary cards at the top, low-stock list and
recent movements below. *This is your screenshot. Make it look finished.*
> Three commits.

---

## Phase 7 — Ship it

**Task 26 — Search and category filter on the products page**
You have done this exact thing before — it is Café Finder. State object,
derive the visible list, render, wire the inputs. Look at `PATTERN-CARD.md`.

**Then, not code:**

- Take 2-3 screenshots (dashboard, products table, product detail)
- Write the README — the template is in the repo, fill it in **in your own
  words**. This is the single most-read file in your whole repo
- Deploy it and put the live link at the top of the README
- Check `.env` is not committed: `git log --all --full-history -- .env`
  should print nothing

---

## Rough pace

| Phase | Tasks | Realistic time |
|---|---|---|
| 1 | 1-3 | 3-4 days |
| 2 | 4-7 | 4-5 days |
| 3 | 8-11 | 5-6 days |
| 4 | 12-15 | 5-6 days |
| 5 | 16-22 | 2 weeks |
| 6 | 23-25 | 5 days |
| 7 | 26 + shipping | 4-5 days |

**About six weeks** at a few hours a week alongside your internship and
final year. That is the honest number. A repo built over six weeks looks
like a repo built over six weeks, and that is exactly the point.

---

## When you get stuck

Send me:
1. The task number
2. Your code
3. What you expected vs what happened

I will do what I have been doing with the drills — run it, measure it, and
show you the evidence. I will not write the task for you, because in six
weeks you need to be able to sit in an interview and explain every file in
this repo.

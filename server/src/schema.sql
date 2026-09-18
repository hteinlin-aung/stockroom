CREATE TABLE IF NOT EXISTS products (
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

CREATE TABLE IF NOT EXISTS movements (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  type       TEXT    NOT NULL,
  quantity   INTEGER NOT NULL,
  note       TEXT,
  created_at TEXT    NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);

require('dotenv').config()
var path = require('path')
var Database = require('better-sqlite3')

var dbPath = path.resolve(process.env.DB_PATH || './jersey-hub.db')
var db = new Database(dbPath)

// Enable WAL mode for better reliability and concurrent reads
db.pragma('journal_mode = WAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    UNIQUE NOT NULL,
    password_hash TEXT    NOT NULL,
    role          TEXT    NOT NULL DEFAULT 'customer',
    created_at    TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    club        TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    price       INTEGER NOT NULL,
    image_url   TEXT    NOT NULL,
    sizes       TEXT    NOT NULL DEFAULT 'S,M,L,XL,XXL',
    stock       INTEGER NOT NULL DEFAULT 50,
    available   INTEGER NOT NULL DEFAULT 1,
    description TEXT    NOT NULL DEFAULT '',
    created_at  TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name  TEXT    NOT NULL,
    customer_phone TEXT    NOT NULL DEFAULT '',
    customer_email TEXT    NOT NULL DEFAULT '',
    items_json     TEXT    NOT NULL,
    total          INTEGER NOT NULL,
    status         TEXT    NOT NULL DEFAULT 'pending',
    notes          TEXT    NOT NULL DEFAULT '',
    created_at     TEXT    DEFAULT (datetime('now'))
  );

  CREATE INDEX IF NOT EXISTS idx_users_email         ON users(email);
  CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
  CREATE INDEX IF NOT EXISTS idx_products_available  ON products(available);
  CREATE INDEX IF NOT EXISTS idx_orders_status       ON orders(status);
  CREATE INDEX IF NOT EXISTS idx_orders_created_at   ON orders(created_at);
`)

module.exports = db

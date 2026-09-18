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
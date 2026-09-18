// TODO — Task 1.
//
// This file opens the SQLite database and makes sure the tables exist,
// then exports the connection so the route files can use it.
//
// What it needs to do:
//   1. open (or create) the database file named in process.env.DB_FILE
//   2. read schema.sql and run it, so the tables exist on first run
//   3. export the connection
//
// better-sqlite3 is already installed. The two methods you need are
//   db.exec(sqlString)   -> run SQL that returns nothing (like CREATE TABLE)
//   db.prepare(sql)      -> build a query you can .get() / .all() / .run()
//
// Write your plan in English here before you write any code:
//   1.
//   2.
//   3.

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
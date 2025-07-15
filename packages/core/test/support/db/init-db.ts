import {migrate} from "drizzle-orm/better-sqlite3/migrator";
import {loadDB} from "./db";
import * as path from 'node:path'
export const migrateDB = (db = loadDB()) => {
  const dir = path.join(import.meta.dirname, '../../drizzle')
  migrate(db, {
    migrationsFolder: dir
  })
}

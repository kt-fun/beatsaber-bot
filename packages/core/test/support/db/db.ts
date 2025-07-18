import {BetterSQLite3Database, drizzle} from "drizzle-orm/better-sqlite3";
import Database from 'better-sqlite3';
import * as tables from './schema'
import {DrizzleDB} from "./dao";
export const loadDB = (path: string = 'sqlite.db') => {
  const db = new Database(path);
  return drizzle(db, {schema: tables})
}

export const getDB = (db: BetterSQLite3Database<typeof tables> = loadDB()) => {
  return new DrizzleDB(db)
}

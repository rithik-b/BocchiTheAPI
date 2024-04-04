import { drizzle } from "drizzle-orm/bun-sqlite"
import { Database } from "bun:sqlite"
import { migrate } from "drizzle-orm/bun-sqlite/migrator"
import { framesTable } from "./schema"

const response = (await Bun.file("/Users/rithikbhatia/repos/BocchiTheAPI/Migrate/response.json").json())[0].result as {
  identifier: string
  source: string
  timestamp: string
}[]
const values = response.map((response) => ({
  id: response.identifier,
  source: response.source.split(":")[1].trim(),
  timestamp: parseInt(response.timestamp),
}))

const sqlite = new Database("db.sqlite")
const db = drizzle(sqlite)
migrate(db, { migrationsFolder: "./drizzle" })
db.insert(framesTable).values(values).execute()

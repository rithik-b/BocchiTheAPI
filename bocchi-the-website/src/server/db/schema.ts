import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const framesTable = sqliteTable("frame", {
  id: text("id").primaryKey(),
  source: text("source").notNull(),
  timestamp: integer("timestamp").notNull(),
})

import { pgTable, text, timestamp, integer, index, unique, varchar } from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    originalUrl: text('original_url').notNull(),
    shortCode: varchar('short_code', { length: 20 }).notNull(),
    createdAt: timestamp('created_at', { mode: "date", withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { mode: "date", withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique('short_code_unique').on(table.shortCode),
    index('user_id_idx').on(table.userId),
    index('short_code_idx').on(table.shortCode),
  ],
);

export type Link = typeof links.$inferSelect;
export type LinkInsert = typeof links.$inferInsert;

import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  imageData: text("image_data").notNull(),
  filters: jsonb("filters").$type<string[]>().default([]).notNull(),
  stickers: jsonb("stickers").$type<string[]>().default([]).notNull(),
  createdAt: text("created_at").notNull()
});

export const insertPhotoSchema = createInsertSchema(photos).omit({ 
  id: true,
  createdAt: true 
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

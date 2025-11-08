import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  codeCompte: text("code_compte").notNull().unique(),
  type: text("type").notNull(),
  status: text("status").notNull().default("active"),
  nom: text("nom").notNull(),
  prenom: text("prenom").notNull(),
  telephone: text("telephone").notNull(),
  activite: text("activite").notNull(),
  adresse: text("adresse"),
  zone: text("zone").notNull(),
  nombreCompte: integer("nombre_compte"),
  montantTotal: integer("montant_total"),
  montantAvecInteret: integer("montant_avec_interet"),
  montant: integer("montant"),
  garantie: text("garantie"),
  echeance: text("echeance"),
  dateCreation: timestamp("date_creation"),
  createdAt: timestamp("created_at").notNull().default(sql`now()`),
  updatedAt: timestamp("updated_at").notNull().default(sql`now()`),
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

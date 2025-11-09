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

const baseInsertSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientSchema = z.object({
  codeCompte: z.string(),
  type: z.string(),
  status: z.string().optional(),
  nom: z.string(),
  prenom: z.string(),
  telephone: z.string(),
  activite: z.string(),
  adresse: z.string().optional(),
  zone: z.string(),
  nombreCompte: z.number().optional(),
  montantTotal: z.number().optional(),
  montantAvecInteret: z.number().optional(),
  montant: z.number().optional(),
  garantie: z.string().optional(),
  echeance: z.string().optional(),
  dateCreation: z.string().optional(),
});

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

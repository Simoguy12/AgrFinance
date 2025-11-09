import { type Client, type InsertClient } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllClients(): Promise<Client[]>;
  getClientsByType(type: string): Promise<Client[]>;
  getClientsByStatus(status: string): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, updates: Partial<Client>): Promise<Client | undefined>;
  deleteClient(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private clients: Map<string, Client>;

  constructor() {
    this.clients = new Map();
  }

  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClientsByType(type: string): Promise<Client[]> {
    return Array.from(this.clients.values()).filter((c) => c.type === type);
  }

  async getClientsByStatus(status: string): Promise<Client[]> {
    return Array.from(this.clients.values()).filter((c) => c.status === status);
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const now = new Date();
    const client: Client = {
      id,
      codeCompte: insertClient.codeCompte,
      type: insertClient.type,
      status: insertClient.status || "active",
      nom: insertClient.nom,
      prenom: insertClient.prenom,
      telephone: insertClient.telephone,
      activite: insertClient.activite,
      zone: insertClient.zone,
      createdAt: now,
      updatedAt: now,
      adresse: insertClient.adresse || null,
      nombreCompte: insertClient.nombreCompte || null,
      montantTotal: insertClient.montantTotal || null,
      montantAvecInteret: insertClient.montantAvecInteret || null,
      montant: insertClient.montant || null,
      garantie: insertClient.garantie || null,
      echeance: insertClient.echeance || null,
      dateCreation: insertClient.dateCreation ? new Date(insertClient.dateCreation) : null,
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updates: Partial<Client>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updatedClient: Client = {
      ...client,
      ...updates,
      updatedAt: new Date(),
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<boolean> {
    return this.clients.delete(id);
  }
}

export const storage = new MemStorage();

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientListItem from "@/components/ClientListItem";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";

const mockClients = [
  { name: "Marie Kouassi", accountNumber: "CR-2024-001", status: "active" as const, amount: 250000, lastActivity: "Il y a 2h" },
  { name: "Jean Baptiste", accountNumber: "CR-2024-002", status: "active" as const, amount: 180000, lastActivity: "Hier" },
  { name: "Fatou Diallo", accountNumber: "CR-2024-003", status: "active" as const, amount: 320000, lastActivity: "Il y a 3h" },
  { name: "Amadou Traoré", accountNumber: "CR-2024-004", status: "active" as const, amount: 150000, lastActivity: "Aujourd'hui" },
];

export default function Credit() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Crédit</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          <div className="space-y-2">
            {filteredClients.map((client) => (
              <ClientListItem
                key={client.accountNumber}
                {...client}
                onClick={() => console.log(`Client ${client.accountNumber} clicked`)}
              />
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun client trouvé</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientListItem from "@/components/ClientListItem";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import { useLocation } from "wouter";

const mockDeletedClients = [
  { name: "Koffi Adjovi", accountNumber: "CR-2023-120", status: "deleted" as const, amount: 100000, lastActivity: "Supprimé il y a 2j" },
  { name: "Adjoa Mensah", accountNumber: "EP-2023-087", status: "deleted" as const, amount: 60000, lastActivity: "Supprimé il y a 1 sem" },
];

export default function Corbeille() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = mockDeletedClients.filter(
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
          <h1 className="text-xl font-semibold text-foreground">Corbeille</h1>
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

          {filteredClients.length > 0 ? (
            <div className="space-y-2">
              {filteredClients.map((client) => (
                <ClientListItem
                  key={client.accountNumber}
                  {...client}
                  onClick={() => console.log(`Client ${client.accountNumber} clicked`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Trash2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-muted-foreground text-base">
                {searchQuery ? "Aucun client trouvé" : "La corbeille est vide"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

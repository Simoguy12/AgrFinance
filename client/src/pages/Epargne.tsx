import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientListItem from "@/components/ClientListItem";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";

const mockCartePointage = [
  { name: "Sophie Mensah", accountNumber: "CP-2024-001", status: "active" as const, amount: 50000, lastActivity: "Hier" },
  { name: "Ibrahim Koné", accountNumber: "CP-2024-002", status: "active" as const, amount: 75000, lastActivity: "Il y a 2j" },
];

const mockCompteCourant = [
  { name: "Aïcha Camara", accountNumber: "CC-2024-001", status: "active" as const, amount: 120000, lastActivity: "Aujourd'hui" },
  { name: "Moussa Sanogo", accountNumber: "CC-2024-002", status: "active" as const, amount: 95000, lastActivity: "Il y a 1h" },
  { name: "Aminata Touré", accountNumber: "CC-2024-003", status: "active" as const, amount: 140000, lastActivity: "Il y a 3h" },
];

export default function Epargne() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"carte-pointage" | "compte-courant">("carte-pointage");
  const [searchQuery, setSearchQuery] = useState("");

  const currentData = activeTab === "carte-pointage" ? mockCartePointage : mockCompteCourant;
  const filteredData = currentData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.accountNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-16 flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLocation("/")}
              data-testid="button-back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold text-foreground">Épargne</h1>
          </div>
          <div className="flex border-b border-card-border -mx-4 px-4">
            <button
              onClick={() => setActiveTab("carte-pointage")}
              className={`flex-1 h-12 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "carte-pointage"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              data-testid="tab-carte-pointage"
            >
              Carte de pointage
            </button>
            <button
              onClick={() => setActiveTab("compte-courant")}
              className={`flex-1 h-12 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "compte-courant"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              data-testid="tab-compte-courant"
            >
              Compte courant
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          <div className="space-y-2">
            {filteredData.map((item) => (
              <ClientListItem
                key={item.accountNumber}
                {...item}
                onClick={() => console.log(`Item ${item.accountNumber} clicked`)}
              />
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune donnée trouvée</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

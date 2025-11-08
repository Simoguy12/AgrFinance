import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientListItem from "@/components/ClientListItem";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";

const mockCreditSolde = [
  { name: "Kofi Mensah", accountNumber: "CR-2023-045", status: "settled" as const, amount: 200000, lastActivity: "15 Jan" },
  { name: "Yao Koffi", accountNumber: "CR-2023-098", status: "settled" as const, amount: 150000, lastActivity: "12 Jan" },
];

const mockEpargneSolde = [
  { name: "Awa Diop", accountNumber: "EP-2023-012", status: "settled" as const, amount: 85000, lastActivity: "18 Jan" },
  { name: "Sekou Touré", accountNumber: "EP-2023-034", status: "settled" as const, amount: 110000, lastActivity: "10 Jan" },
];

export default function Solde() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"credit" | "epargne">("credit");
  const [searchQuery, setSearchQuery] = useState("");

  const currentData = activeTab === "credit" ? mockCreditSolde : mockEpargneSolde;
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
            <h1 className="text-xl font-semibold text-foreground">Soldé</h1>
          </div>
          <div className="flex border-b border-card-border -mx-4 px-4">
            <button
              onClick={() => setActiveTab("credit")}
              className={`flex-1 h-12 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "credit"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              data-testid="tab-credit-solde"
            >
              Crédit soldé
            </button>
            <button
              onClick={() => setActiveTab("epargne")}
              className={`flex-1 h-12 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "epargne"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground"
              }`}
              data-testid="tab-epargne-solde"
            >
              Épargne soldé
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

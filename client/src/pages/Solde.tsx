import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface Client {
  id: string;
  codeCompte: string;
  nom: string;
  prenom: string;
  type: string;
  status: string;
  montantAvecInteret?: number;
  montantTotal?: number;
  montant?: number;
}

export default function Solde() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"credit" | "epargne">("credit");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const settledClients = clients.filter((c) => c.status === "settled");

  const currentData =
    activeTab === "credit"
      ? settledClients.filter((c) => c.type === "credit")
      : settledClients.filter((c) => c.type === "carte-pointage" || c.type === "compte-courant");

  const filteredData = currentData.filter(
    (item) =>
      item.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.codeCompte.toLowerCase().includes(searchQuery.toLowerCase())
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

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredData.map((client) => (
                <div
                  key={client.codeCompte}
                  className="bg-card border border-card-border rounded-lg p-4"
                  data-testid={`client-${client.codeCompte}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-foreground">
                        {client.prenom} {client.nom}
                      </h3>
                      <p className="text-sm font-mono text-muted-foreground mt-0.5">
                        {client.codeCompte}
                      </p>
                      <Badge variant="outline" className="mt-2 bg-chart-2/10 text-chart-2 border-chart-2/20">
                        Soldé
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium font-mono text-foreground">
                        {(client.montantAvecInteret || client.montant || 0).toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "Aucune donnée trouvée" : "Aucun compte soldé"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

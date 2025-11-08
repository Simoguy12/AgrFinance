import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Client {
  codeCompte: string;
  nom: string;
  prenom: string;
  type: string;
  status: string;
  montant?: number;
  createdAt: string;
}

export default function Epargne() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"carte-pointage" | "compte-courant">("carte-pointage");
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  const loadClients = () => {
    const stored = localStorage.getItem("clients");
    if (stored) {
      const allClients = JSON.parse(stored);
      const epargneClients = allClients.filter(
        (c: Client) =>
          (c.type === "carte-pointage" || c.type === "compte-courant") &&
          c.status === "active"
      );
      setClients(epargneClients);
    }
  };

  useEffect(() => {
    loadClients();
    const interval = setInterval(loadClients, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSolder = (client: Client) => {
    const stored = localStorage.getItem("clients");
    if (stored) {
      const allClients = JSON.parse(stored);
      const updated = allClients.map((c: Client) =>
        c.codeCompte === client.codeCompte ? { ...c, status: "settled" } : c
      );
      localStorage.setItem("clients", JSON.stringify(updated));
      loadClients();
      toast({
        title: "Compte soldé",
        description: `Le compte de ${client.prenom} ${client.nom} a été soldé.`,
      });
    }
  };

  const currentData = clients.filter((c) => c.type === activeTab);
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

          <div className="space-y-3">
            {filteredData.map((client) => (
              <div
                key={client.codeCompte}
                className="bg-card border border-card-border rounded-lg p-4"
                data-testid={`client-${client.codeCompte}`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-foreground">
                        {client.prenom} {client.nom}
                      </h3>
                      <p className="text-sm font-mono text-muted-foreground mt-0.5">
                        {client.codeCompte}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium font-mono text-foreground">
                        {client.montant?.toLocaleString('fr-FR') || 0} FCFA
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSolder(client)}
                    className="w-full"
                    data-testid={`button-solder-${client.codeCompte}`}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Solder le compte
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "Aucune donnée trouvée" : "Aucune épargne active"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

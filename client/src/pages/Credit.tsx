import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, CheckCircle2, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface Client {
  codeCompte: string;
  nom: string;
  prenom: string;
  type: string;
  status: string;
  montantAvecInteret?: number;
  montantTotal?: number;
  nombreCompte?: string;
  createdAt: string;
}

export default function Credit() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();

  const loadClients = () => {
    const stored = localStorage.getItem("clients");
    if (stored) {
      const allClients = JSON.parse(stored);
      const creditClients = allClients.filter(
        (c: Client) => c.type === "credit" && c.status === "active"
      );
      setClients(creditClients);
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

  const handleContentieux = (client: Client) => {
    const stored = localStorage.getItem("clients");
    if (stored) {
      const allClients = JSON.parse(stored);
      const updated = allClients.map((c: Client) =>
        c.codeCompte === client.codeCompte ? { ...c, status: "litigation" } : c
      );
      localStorage.setItem("clients", JSON.stringify(updated));
      loadClients();
      toast({
        title: "Mis en contentieux",
        description: `Le compte de ${client.prenom} ${client.nom} est maintenant en contentieux.`,
      });
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.codeCompte.toLowerCase().includes(searchQuery.toLowerCase())
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

          <div className="space-y-3">
            {filteredClients.map((client) => (
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
                      {client.nombreCompte && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {client.nombreCompte} comptes
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium font-mono text-foreground">
                        {client.montantAvecInteret?.toLocaleString('fr-FR') || 0} FCFA
                      </p>
                      {client.montantTotal && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Base: {client.montantTotal.toLocaleString('fr-FR')} FCFA
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSolder(client)}
                      className="flex-1"
                      data-testid={`button-solder-${client.codeCompte}`}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Solder
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleContentieux(client)}
                      className="flex-1"
                      data-testid={`button-contentieux-${client.codeCompte}`}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      Contentieux
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? "Aucun client trouvé" : "Aucun crédit actif"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

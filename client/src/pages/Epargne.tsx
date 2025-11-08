import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Client {
  id: string;
  codeCompte: string;
  nom: string;
  prenom: string;
  type: string;
  status: string;
  montant?: number;
}

export default function Epargne() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"carte-pointage" | "compte-courant">("carte-pointage");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Client> }) => {
      return apiRequest("PATCH", `/api/clients/${id}`, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
    },
  });

  const handleSolder = (client: Client) => {
    updateMutation.mutate(
      { id: client.id, updates: { status: "settled" } },
      {
        onSuccess: () => {
          toast({
            title: "Compte soldé",
            description: `Le compte de ${client.prenom} ${client.nom} a été soldé.`,
          });
        },
      }
    );
  };

  const epargneClients = clients.filter(
    (c) => (c.type === "carte-pointage" || c.type === "compte-courant") && c.status === "active"
  );

  const currentData = epargneClients.filter((c) => c.type === activeTab);

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
                      disabled={updateMutation.isPending}
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
          )}

          {!isLoading && filteredData.length === 0 && (
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

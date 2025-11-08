import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

type FormType = "credit" | "compte-courant" | "carte-pointage";

export default function Add() {
  const [, setLocation] = useLocation();
  const [formType, setFormType] = useState<FormType>("credit");
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    amount: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", { type: formType, ...formData });
    setFormData({ name: "", accountNumber: "", amount: "", notes: "" });
  };

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
          <h1 className="text-xl font-semibold text-foreground">Ajouter</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button
              variant={formType === "credit" ? "default" : "outline"}
              onClick={() => setFormType("credit")}
              className="flex-1"
              data-testid="button-type-credit"
            >
              Crédit
            </Button>
            <Button
              variant={formType === "compte-courant" ? "default" : "outline"}
              onClick={() => setFormType("compte-courant")}
              className="flex-1"
              data-testid="button-type-compte-courant"
            >
              Compte courant
            </Button>
            <Button
              variant={formType === "carte-pointage" ? "default" : "outline"}
              onClick={() => setFormType("carte-pointage")}
              className="flex-1"
              data-testid="button-type-carte-pointage"
            >
              Carte de pointage
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du client</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Entrez le nom complet"
                required
                data-testid="input-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="accountNumber">Numéro de compte</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                placeholder="Ex: CR-2024-001"
                className="font-mono"
                required
                data-testid="input-account-number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0"
                className="font-mono"
                required
                data-testid="input-amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations supplémentaires..."
                rows={4}
                data-testid="input-notes"
              />
            </div>

            <Button type="submit" className="w-full" data-testid="button-submit">
              Enregistrer
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}

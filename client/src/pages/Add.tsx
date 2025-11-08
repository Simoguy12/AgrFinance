import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Wallet, ClipboardCheck } from "lucide-react";
import { useLocation } from "wouter";

export default function Add() {
  const [, setLocation] = useLocation();

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

      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          <button
            onClick={() => setLocation("/add/credit")}
            className="w-full bg-card border border-card-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover-elevate active-elevate-2"
            data-testid="button-add-credit"
          >
            <CreditCard className="w-16 h-16 text-primary" strokeWidth={2} />
            <span className="text-2xl font-semibold text-foreground">Crédit</span>
          </button>

          <button
            onClick={() => setLocation("/add/compte-courant")}
            className="w-full bg-card border border-card-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover-elevate active-elevate-2"
            data-testid="button-add-compte-courant"
          >
            <Wallet className="w-16 h-16 text-primary" strokeWidth={2} />
            <span className="text-2xl font-semibold text-foreground">Compte courant</span>
          </button>

          <button
            onClick={() => setLocation("/add/carte-pointage")}
            className="w-full bg-card border border-card-border rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover-elevate active-elevate-2"
            data-testid="button-add-carte-pointage"
          >
            <ClipboardCheck className="w-16 h-16 text-primary" strokeWidth={2} />
            <span className="text-2xl font-semibold text-foreground">Carte de pointage</span>
          </button>
        </div>
      </main>
    </div>
  );
}

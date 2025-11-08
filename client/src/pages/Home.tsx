import CategoryButton from "@/components/CategoryButton";
import { CreditCard, PiggyBank, CheckCircle2, AlertTriangle, BarChart3, Trash2 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-card border-b border-card-border sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">AGR Finance</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CategoryButton icon={CreditCard} label="Crédit" path="/credit" />
          <CategoryButton icon={PiggyBank} label="Épargne" path="/epargne" />
          <CategoryButton icon={CheckCircle2} label="Soldé" path="/solde" />
          <CategoryButton icon={AlertTriangle} label="Contencieux" path="/contencieux" />
          <CategoryButton icon={BarChart3} label="Performance" path="/performance" />
          <CategoryButton icon={Trash2} label="Corbeille" path="/corbeille" />
        </div>
      </main>
    </div>
  );
}

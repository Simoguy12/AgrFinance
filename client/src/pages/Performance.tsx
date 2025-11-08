import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import { ArrowLeft, DollarSign, Users, TrendingUp, CheckCircle2, AlertTriangle, PiggyBank } from "lucide-react";
import { useLocation } from "wouter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", credits: 2400000, epargne: 1200000 },
  { month: "Fév", credits: 1800000, epargne: 980000 },
  { month: "Mar", credits: 3200000, epargne: 1500000 },
  { month: "Avr", credits: 2800000, epargne: 1350000 },
  { month: "Mai", credits: 3500000, epargne: 1680000 },
  { month: "Juin", credits: 3100000, epargne: 1420000 },
];

export default function Performance() {
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
          <h1 className="text-xl font-semibold text-foreground">Performance</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon={DollarSign} label="Total Crédit" value="12.5M" trend="+12%" />
            <StatCard icon={PiggyBank} label="Total Épargne" value="8.2M" trend="+8%" />
            <StatCard icon={Users} label="Clients Actifs" value="156" />
            <StatCard icon={CheckCircle2} label="Comptes Soldés" value="42" />
            <StatCard icon={AlertTriangle} label="Contentieux" value="3" />
            <StatCard icon={TrendingUp} label="Taux de réussite" value="94%" trend="+2%" />
          </div>

          <div className="bg-card border border-card-border rounded-lg p-4">
            <h2 className="text-lg font-semibold text-foreground mb-4">Évolution mensuelle</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--card-border))",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="credits" fill="hsl(var(--primary))" name="Crédits" radius={[4, 4, 0, 0]} />
                <Bar dataKey="epargne" fill="hsl(var(--chart-2))" name="Épargne" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}

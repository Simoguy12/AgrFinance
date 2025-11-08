import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ClientListItemProps {
  name: string;
  accountNumber: string;
  status: "active" | "settled" | "litigation" | "deleted";
  amount: number;
  lastActivity?: string;
  onClick?: () => void;
  testId?: string;
}

const statusConfig = {
  active: { label: "Actif", className: "bg-primary/10 text-primary border-primary/20" },
  settled: { label: "Soldé", className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
  litigation: { label: "Contentieux", className: "bg-destructive/10 text-destructive border-destructive/20" },
  deleted: { label: "Supprimé", className: "bg-muted text-muted-foreground border-muted" },
};

export default function ClientListItem({
  name,
  accountNumber,
  status,
  amount,
  lastActivity,
  onClick,
  testId,
}: ClientListItemProps) {
  const statusInfo = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className="w-full bg-card border border-card-border rounded-lg p-4 hover-elevate active-elevate-2 text-left"
      data-testid={testId || `client-${accountNumber}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-foreground truncate">{name}</h3>
          <p className="text-sm font-mono text-muted-foreground mt-0.5">{accountNumber}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className={`text-xs ${statusInfo.className}`}>
              {statusInfo.label}
            </Badge>
            {lastActivity && (
              <span className="text-xs text-muted-foreground">{lastActivity}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-base font-medium font-mono text-foreground">
              {amount.toLocaleString('fr-FR')} FCFA
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </button>
  );
}

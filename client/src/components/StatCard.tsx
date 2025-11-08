import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  testId?: string;
}

export default function StatCard({ icon: Icon, label, value, trend, testId }: StatCardProps) {
  return (
    <div
      className="bg-card border border-card-border rounded-lg p-4"
      data-testid={testId || `stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-2">
        <Icon className="w-5 h-5 text-primary" strokeWidth={2} />
        {trend && (
          <span className="text-xs font-medium text-primary">{trend}</span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

import StatCard from '../StatCard';
import { DollarSign, TrendingUp } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-4 grid grid-cols-2 gap-4">
      <StatCard icon={DollarSign} label="Total Crédit" value="12.5M" trend="+12%" />
      <StatCard icon={TrendingUp} label="Clients Actifs" value="156" />
    </div>
  );
}

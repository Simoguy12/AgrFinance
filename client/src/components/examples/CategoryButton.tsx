import CategoryButton from '../CategoryButton';
import { CreditCard } from 'lucide-react';

export default function CategoryButtonExample() {
  return (
    <div className="p-4 max-w-xs">
      <CategoryButton icon={CreditCard} label="Crédit" path="/credit" />
    </div>
  );
}

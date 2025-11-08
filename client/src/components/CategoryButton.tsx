import { LucideIcon } from "lucide-react";
import { Link } from "wouter";

interface CategoryButtonProps {
  icon: LucideIcon;
  label: string;
  path: string;
  testId?: string;
}

export default function CategoryButton({ icon: Icon, label, path, testId }: CategoryButtonProps) {
  return (
    <Link href={path}>
      <button
        className="w-full aspect-[1/1.2] bg-card border border-card-border rounded-xl flex flex-col items-center justify-center gap-3 hover-elevate active-elevate-2"
        data-testid={testId || `button-category-${label.toLowerCase()}`}
      >
        <Icon className="w-12 h-12 text-primary" strokeWidth={2} />
        <span className="text-lg font-semibold text-foreground">{label}</span>
      </button>
    </Link>
  );
}

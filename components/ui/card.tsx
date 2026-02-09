import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900",
        hover &&
          "transition-all duration-200 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5",
        className
      )}
    >
      {children}
    </div>
  );
}

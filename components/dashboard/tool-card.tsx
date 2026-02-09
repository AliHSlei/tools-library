import Link from "next/link";
import {
  FileText,
  Ruler,
  DollarSign,
  Languages,
  ImagePlus,
  ArrowRight,
} from "lucide-react";
import { ToolDefinition } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  FileText,
  Ruler,
  DollarSign,
  Languages,
  ImagePlus,
};

interface ToolCardProps {
  tool: ToolDefinition;
  index: number;
}

export function ToolCard({ tool, index }: ToolCardProps) {
  const Icon = iconMap[tool.icon];

  return (
    <Link
      href={tool.href}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6",
        "dark:border-surface-800 dark:bg-surface-900",
        "transition-all duration-200 hover:border-brand-500/50 hover:shadow-lg hover:shadow-brand-500/5",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-surface-800",
          tool.color
        )}
      >
        {Icon && <Icon size={24} />}
      </div>

      <div className="flex flex-1 flex-col gap-1.5">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{tool.name}</h3>
        <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
          {tool.description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-sm font-medium text-brand-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400">
        Open tool
        <ArrowRight size={14} />
      </div>
    </Link>
  );
}

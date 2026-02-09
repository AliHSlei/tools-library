import { TOOLS } from "@/lib/constants";
import { ToolCard } from "./tool-card";

export function ToolGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {TOOLS.filter((t) => t.status === "active").map((tool, index) => (
        <ToolCard key={tool.id} tool={tool} index={index} />
      ))}
    </div>
  );
}

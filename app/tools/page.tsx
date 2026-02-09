import { ToolGrid } from "@/components/dashboard/tool-grid";

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          All Tools
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Browse all available utilities
        </p>
      </div>
      <ToolGrid />
    </div>
  );
}

import { ToolGrid } from "@/components/dashboard/tool-grid";
import { APP_NAME } from "@/lib/constants";

export default function Home() {
  return (
    <div className="space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-gray-50">
          {APP_NAME}
        </h1>
        <p className="text-lg text-gray-400">
          A growing collection of useful tools, all in one place.
        </p>
      </div>
      <ToolGrid />
    </div>
  );
}

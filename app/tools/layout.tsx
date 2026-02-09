import { Breadcrumb } from "@/components/layout/breadcrumb";

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Breadcrumb />
      {children}
    </div>
  );
}

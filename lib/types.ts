export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  status: "active" | "coming-soon";
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

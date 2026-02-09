"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return { href, label };
  });

  return (
    <nav className="flex items-center gap-1.5 text-sm text-gray-400">
      <Link
        href="/"
        className="flex items-center gap-1 transition-colors hover:text-gray-200"
      >
        <Home size={14} />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight size={14} className="text-gray-600" />
          <Link
            href={crumb.href}
            className="transition-colors hover:text-gray-200"
          >
            {crumb.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

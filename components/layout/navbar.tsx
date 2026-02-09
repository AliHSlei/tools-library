"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { APP_NAME } from "@/lib/constants";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-surface-800 dark:bg-surface-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-gray-900 transition-colors hover:text-brand-500 dark:text-gray-100 dark:hover:text-brand-400"
        >
          <Wrench size={22} className="text-brand-500 dark:text-brand-400" />
          {APP_NAME}
        </Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}

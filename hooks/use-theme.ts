"use client";

import { useContext } from "react";
import { ThemeContext } from "@/lib/theme-provider";

export function useTheme() {
  return useContext(ThemeContext);
}

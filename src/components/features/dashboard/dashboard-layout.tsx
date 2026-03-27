"use client";

import type * as React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      {/* Desktop: ml-64 (margin-left for sidebar), Mobile: ml-0 */}
      <div className="ml-0 flex min-h-screen flex-col lg:ml-64">
        <Header />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

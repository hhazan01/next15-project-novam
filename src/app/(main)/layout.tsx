import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/utils/dynamic-breadcrumb";
import NotAutorized from "@/components/utils/not-autorized";
import { NavActions } from "@/components/nav-actions";
import { AccessControl } from "@/components/auth/access-control";
import { Providers } from "@/components/utils/providers";
import { auth } from "@/auth";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) return <NotAutorized />;

  return (
    <Providers>
      <SidebarProvider
        style={{ "--sidebar-width": "16rem" } as React.CSSProperties}
      >
        <AppSidebar
          variant="floating"
          collapsible="icon"
          session={session.user}
        />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumb />
            <div className="ml-auto px-1">
              <NavActions session={session.user} />
            </div>
          </header>
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <AccessControl permissions={session.user.permissions}>
              {children}
            </AccessControl>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Providers>
  );
}

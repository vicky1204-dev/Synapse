import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SessionGuard } from "@/components/auth/session-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-background m-4 rounded-2xl px-6 py-4 shadow-md">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </SessionGuard>
  );
}

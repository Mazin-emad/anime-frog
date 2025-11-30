import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./SideBare";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}

import {
  Heart,
  Home,
  Info,
  List,
  LogOutIcon,
  Search,
  SettingsIcon,
  UserIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ModeToggle } from "../ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "sonner";
import { useState } from "react";
import { ProfileDialog } from "../../profile/ProfileDialog";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Lists",
    url: "/lists",
    icon: List,
  },
  {
    title: "Favorites",
    url: "/favorites",
    icon: Heart,
  },
  {
    title: "Search Anime",
    url: "/search",
    icon: Search,
  },
  {
    title: "About",
    url: "/about",
    icon: Info,
  },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully", {
      description: "You have been logged out",
    });
  };

  const openProfileDialog = () => {
    setShowProfileDialog(true);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>Anime Frog</SidebarHeader>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarFooter className="mt-auto">
          <SidebarMenuButton onClick={openProfileDialog}>
            <UserIcon className="w-4 h-4" />
            <span>{user?.name || "Guest"}</span>
          </SidebarMenuButton>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="outline" size="icon">
              <SettingsIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOutIcon className="w-4 h-4" />
            </Button>
          </div>
        </SidebarFooter>
      </SidebarContent>
      <ProfileDialog
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
    </Sidebar>
  );
}

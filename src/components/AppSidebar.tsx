import { Home, Users, UserCircle, AlertTriangle, FileText, GraduationCap } from "lucide-react";
import { NavLink } from "@/components/NavLink";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const advisorItems = [
  { title: "Dashboard", url: "/advisor", icon: Home },
  { title: "My Students", url: "/advisor/students", icon: Users },
  { title: "Risk Alerts", url: "/advisor/alerts", icon: AlertTriangle },
];

const studentItems = [
  { title: "Dashboard", url: "/student", icon: Home },
  { title: "My Progress", url: "/student/progress", icon: FileText },
];

interface AppSidebarProps {
  role?: "advisor" | "student";
}

export function AppSidebar({ role = "advisor" }: AppSidebarProps) {
  const { state } = useSidebar();
  const items = role === "advisor" ? advisorItems : studentItems;
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg text-primary">Horizon</span>
          </div>
        )}
        {isCollapsed && <GraduationCap className="h-6 w-6 text-primary mx-auto" />}
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{role === "advisor" ? "Advisor" : "Student"}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/advisor" || item.url === "/student"}
                      className="hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

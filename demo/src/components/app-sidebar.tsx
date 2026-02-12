"use client";

import { Link, useLocation } from "react-router-dom";
import { ActivityIcon, ChartColumnIcon, FolderTreeIcon, LayoutGridIcon, TriangleAlertIcon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, EXAMPLE_COUNTS, getCategoryLabel } from "@/lib/examples";

function isRouteActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="gap-3">
        <div className="flex items-center justify-between gap-2 rounded-lg border bg-card px-3 py-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">@devstool/shadcn-echarts</p>
            <p className="text-xs text-muted-foreground">ECharts parity workbench</p>
          </div>
          <Badge variant="secondary">{EXAMPLE_COUNTS.total}</Badge>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive(location.pathname, "/")}>
                <Link to="/">
                  <LayoutGridIcon />
                  <span>Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive(location.pathname, "/examples")}>
                <Link to="/examples">
                  <ChartColumnIcon />
                  <span>All Examples</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuBadge>{EXAMPLE_COUNTS.supported}</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive(location.pathname, "/unsupported")}>
                <Link to="/unsupported">
                  <TriangleAlertIcon />
                  <span>Unsupported</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuBadge>{EXAMPLE_COUNTS.unsupported}</SidebarMenuBadge>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isRouteActive(location.pathname, "/diagnostics")}>
                <Link to="/diagnostics">
                  <ActivityIcon />
                  <span>Diagnostics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {CATEGORIES.map((category) => {
              const href = `/category/${category}`;
              const counts = EXAMPLE_COUNTS.byCategory[category];
              return (
                <SidebarMenuItem key={category}>
                  <SidebarMenuButton asChild isActive={isRouteActive(location.pathname, href)}>
                    <Link to={href}>
                      <FolderTreeIcon />
                      <span>{getCategoryLabel(category)}</span>
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{counts?.total ?? 0}</SidebarMenuBadge>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg border bg-card px-2 py-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Theme</span>
          <ThemeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

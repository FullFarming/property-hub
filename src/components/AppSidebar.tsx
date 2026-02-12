import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  List,
  Building2,
  Users,
  FolderOpen,
  Bell,
  Settings,
  User,
  ChevronLeft,
  ChevronDown,
  Building,
  Store,
  ClipboardList,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Workspace = "building_invest" | "retail" | "office_lease";

const workspaces: { id: Workspace; label: string; icon: React.ReactNode }[] = [
  { id: "building_invest", label: "빌딩 투자", icon: <Building className="h-4 w-4" /> },
  { id: "retail", label: "리테일 중개", icon: <Store className="h-4 w-4" /> },
  { id: "office_lease", label: "오피스 임대관리", icon: <ClipboardList className="h-4 w-4" /> },
];

const menuItems = [
  { label: "대시보드", icon: LayoutDashboard, path: "/" },
  { label: "지도", icon: Map, path: "/map" },
  { label: "매물 목록", icon: List, path: "/listings" },
  { label: "건물 DB", icon: Building2, path: "/buildings" },
  { label: "고객 관리", icon: Users, path: "/customers" },
  { label: "내 문서", icon: FolderOpen, path: "/documents" },
];

const bottomItems = [
  { label: "알림", icon: Bell, path: "/notifications" },
  { label: "설정", icon: Settings, path: "/settings" },
  { label: "내 프로필", icon: User, path: "/profile" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [wsOpen, setWsOpen] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>("building_invest");
  const location = useLocation();
  const currentWs = workspaces.find((w) => w.id === workspace)!;

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border bg-card transition-default h-screen sticky top-0 z-30 shrink-0",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Workspace Switcher */}
      <div className="p-3 border-b border-border relative">
        <button
          onClick={() => !collapsed && setWsOpen(!wsOpen)}
          className={cn(
            "flex items-center gap-2 w-full rounded-md p-2 hover:bg-muted transition-default text-left",
            collapsed && "justify-center"
          )}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
            {currentWs.icon}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-caption font-semibold truncate">{currentWs.label}</p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-default", wsOpen && "rotate-180")} />
            </>
          )}
        </button>
        {wsOpen && !collapsed && (
          <div className="absolute left-3 right-3 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden animate-fade-in">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => { setWorkspace(ws.id); setWsOpen(false); }}
                className={cn(
                  "flex items-center gap-3 w-full px-3 py-2.5 text-sm hover:bg-muted transition-default",
                  ws.id === workspace && "bg-primary/5 text-primary font-medium"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-7 h-7 rounded-md",
                  ws.id === workspace ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {ws.icon}
                </div>
                {ws.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-2">
          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground bg-muted rounded-lg hover:bg-muted/80 transition-default">
            <Search className="h-4 w-4" />
            <span>검색</span>
            <span className="ml-auto text-xs text-tertiary">⌘K</span>
          </button>
        </div>
      )}

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-1 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-default group",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="px-2 py-2 border-t border-border space-y-0.5">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-default",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* Collapse Button */}
      <div className="px-2 py-2 border-t border-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-default w-full",
            collapsed && "justify-center px-0"
          )}
        >
          <ChevronLeft className={cn("h-5 w-5 shrink-0 transition-default", collapsed && "rotate-180")} />
          {!collapsed && <span>사이드바 접기</span>}
        </button>
      </div>
    </aside>
  );
}

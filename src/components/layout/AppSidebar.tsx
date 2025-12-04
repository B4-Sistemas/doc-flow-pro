import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  DollarSign, 
  Users, 
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import logoHeader from '@/assets/logo-header.png';

const navItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Contratos', url: '/contracts', icon: FileText },
  { title: 'Organizações', url: '/organizations', icon: Building2 },
  { title: 'Financeiro', url: '/billing', icon: DollarSign },
  { title: 'Usuários', url: '/users', icon: Users },
  { title: 'Configurações', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className={cn(
          "flex items-center border-b border-sidebar-border h-16 px-4",
          collapsed ? "justify-center" : "justify-between"
        )}>
          {!collapsed && (
            <div className="flex items-center gap-3">
              <img src={logoHeader} alt="B4 Sign" className="h-8 w-auto" />
              <span className="font-bold text-lg text-primary">B4 Sign</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground transition-colors",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                collapsed && "justify-center px-0"
              )}
              activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.title}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full text-sidebar-foreground hover:text-destructive hover:bg-sidebar-accent",
              collapsed ? "justify-center px-0" : "justify-start"
            )}
          >
            <LogOut className="h-5 w-5" />
            {!collapsed && <span className="ml-3">Sair</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}


import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  LayoutDashboard, 
  TestTube2, 
  Settings, 
  Menu, 
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  href: string;
  label: string;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, href, label, isActive }: NavItemProps) => {
  return (
    <Link to={href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 mb-1 font-normal rounded-md",
          isActive 
            ? "bg-sidebar-accent text-sidebar-accent-foreground" 
            : "text-sidebar-foreground hover:bg-sidebar-accent/50"
        )}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const navItems = [
    { icon: Home, href: '/', label: '项目介绍' },
    { icon: LayoutDashboard, href: '/dashboard', label: '监控看板' },
    { icon: TestTube2, href: '/testing', label: '分步测试' },
    { icon: Settings, href: '/settings', label: '参数设置' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar toggle button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full"
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-sidebar fixed inset-y-0 left-0 z-20 w-64 transform overflow-y-auto border-r border-sidebar-border transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        <div className="p-4">
          <div className="flex items-center mb-6 mt-2">
            <span className="text-sidebar-foreground text-xl font-semibold ml-2">
              智能实验室用电管理
            </span>
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                href={item.href}
                label={item.label}
                isActive={location.pathname === item.href}
              />
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "flex-1 overflow-x-hidden transition-all",
          sidebarOpen ? "md:ml-64" : ""
        )}
      >
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;

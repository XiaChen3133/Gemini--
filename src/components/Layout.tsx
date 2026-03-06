import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Target, Settings } from 'lucide-react';
import { clsx } from 'clsx';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Today', icon: LayoutDashboard },
    { path: '/pool', label: 'Pool', icon: ListTodo },
    { path: '/goals', label: '成长', icon: Target },
    { path: '/settings', label: 'Data', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#1A6840]/10">
      <main className="max-w-md mx-auto min-h-screen bg-white shadow-sm flex flex-col relative">
        <div className="flex-1 p-6 pb-24">
          {children}
        </div>
        
        <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 max-w-md mx-auto z-40">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                    isActive ? "text-[#1A6840] scale-110" : "text-gray-400 hover:text-gray-600"
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}

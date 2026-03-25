'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/link';
import { 
  Home, 
  Users, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      description: 'Resumen general'
    },
    {
      title: 'Propiedades',
      href: '/properties',
      icon: Home,
      description: 'Gestión de propiedades'
    },
    {
      title: 'Vendedores',
      href: '/agents',
      icon: Users,
      description: 'Gestión de agentes'
    },
    {
      title: 'Clientes',
      href: '/clients',
      icon: Users,
      description: 'Gestión de clientes'
    },
    {
      title: 'Reportes',
      href: '/reports',
      icon: Settings,
      description: 'Reportes y análisis'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CRM</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900">
              Inmobiliario
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <Icon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                  <div className="flex-1">
                    <div className="text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* User Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="px-3 py-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">JD</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Juan Pérez</div>
                  <div className="text-xs text-gray-500">Broker</div>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Settings className="mr-3 h-5 w-5 text-gray-500" />
                <span className="text-gray-900">Mi Perfil</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors justify-start"
              >
                <LogOut className="mr-3 h-5 w-5 text-gray-500" />
                <span className="text-gray-900">Cerrar Sesión</span>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar propiedades, clientes..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 11 14 0 0-11 14" />
                  </svg>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.406-1.406A2.992 2.992 0 0116.594 5.708l-5.094 5.094A11.002 11.002 0 013 18c-2.796 0-5.487-.46-7.937-1.278l1.414-1.414A2.992 2.992 0 0115.708 5.293l-5.094 5.094A11.002 11.002 0 0112 18z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    3
                  </span>
                </Button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-3">
                <Badge variant="outline" className="text-xs">
                  Broker
                </Badge>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">JD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
        </div>
      )}
    </div>
  );
}

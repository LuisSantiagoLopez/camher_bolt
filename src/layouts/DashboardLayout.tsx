import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { LogOut } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, signOut } = useAuthStore();

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'taller':
        return 'Panel de Taller';
      case 'taller_jr':
        return 'Panel de Taller Jr';
      case 'proveedor':
        return 'Panel de Proveedor';
      case 'administrador':
        return 'Panel de Administrador';
      case 'contador':
        return 'Panel de Contador';
      case 'contador_jr':
        return 'Panel de Contador Jr';
      default:
        return 'Panel';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {getRoleTitle()}
              </h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => signOut()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
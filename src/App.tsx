import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Login from './pages/Login';
import Documentation from './pages/Documentation';
import DashboardLayout from './layouts/DashboardLayout';
import TallerDashboard from './pages/dashboards/TallerDashboard';
import TallerJrDashboard from './pages/dashboards/TallerJrDashboard';
import ProveedorDashboard from './pages/dashboards/ProveedorDashboard';
import AdministradorDashboard from './pages/dashboards/AdministradorDashboard';
import ContadorDashboard from './pages/dashboards/ContadorDashboard';
import ContadorJrDashboard from './pages/dashboards/ContadorJrDashboard';

function App() {
  const { user, loading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        <Routes>
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={
              (() => {
                switch (user.role) {
                  case 'taller':
                    return <TallerDashboard />;
                  case 'taller_jr':
                    return <TallerJrDashboard />;
                  case 'proveedor':
                    return <ProveedorDashboard />;
                  case 'administrador':
                    return <AdministradorDashboard />;
                  case 'contador':
                    return <ContadorDashboard />;
                  case 'contador_jr':
                    return <ContadorJrDashboard />;
                  default:
                    return <Navigate to="/login" />;
                }
              })()
            } />
          </Route>
          <Route path="/docs" element={<Documentation />} />
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
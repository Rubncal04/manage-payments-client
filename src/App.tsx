import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { HomePage } from './presentation/pages/HomePage';
import { PaymentPage } from './presentation/pages/PaymentPage';
import { PaymentHistoryPage } from './presentation/pages/PaymentHistoryPage';
import { StatisticsPage } from './presentation/pages/StatisticsPage';
import { LoginPage } from './presentation/pages/LoginPage';
import { RegisterPage } from './presentation/pages/RegisterPage';
import { Navbar } from './presentation/components/Navbar';
import { ProtectedRoute } from './presentation/components/auth/ProtectedRoute';
import { ClientDetailsPage } from './presentation/pages/ClientDetailsPage';
import { EditClientPage } from './presentation/pages/EditClientPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Rutas públicas de autenticación */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          <Route path="/auth">
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={
              <div className="min-h-screen bg-gray-900">
                <Navbar />
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                  <Outlet />
                </main>
              </div>
            }>
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/clients/:id" element={<ClientDetailsPage />} />
              <Route path="/clients/:id/edit" element={<EditClientPage />} />
              <Route path="/users/payment/:id" element={<PaymentPage />} />
              <Route path="/payments/history" element={<PaymentHistoryPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
            </Route>
          </Route>

          {/* Ruta para manejar URLs no encontradas */}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

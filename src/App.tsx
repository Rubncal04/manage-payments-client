import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './presentation/pages/HomePage';
import { NewUserPage } from './presentation/pages/NewUserPage';
import { PaymentPage } from './presentation/pages/PaymentPage';
import { Navbar } from './presentation/components/Navbar';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/new-user" element={<NewUserPage />} />
              <Route path="/payment/:id" element={<PaymentPage />} />
              {/* Aquí agregaremos más rutas cuando creemos las páginas correspondientes */}
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

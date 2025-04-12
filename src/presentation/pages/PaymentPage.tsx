import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentForm } from '../components/PaymentForm';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const client = location.state?.client;

  if (!client) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="rounded-lg bg-red-900/50 p-4 border border-red-800">
            <p className="text-red-300">No se encontró la información del cliente</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentForm clientId={client.id} onPaymentComplete={() => navigate('/')} />
    </div>
  );
};

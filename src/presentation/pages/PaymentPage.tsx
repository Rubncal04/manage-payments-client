import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PaymentForm } from '../components/PaymentForm';
import { clientService } from '../../core/services/clientService';
import { Client } from '../../core/domain/Client';

export const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const clientId = searchParams.get('clientId');

        if (!clientId) {
          setError('No se proporcionó un ID de cliente válido');
          setIsLoading(false);
          return;
        }

        const clientData = await clientService.getClientById(clientId);
        if (!clientData) {
          setError('No se encontró la información del cliente');
          return;
        }

        setClient(clientData);
      } catch (error) {
        console.error('Error al cargar el cliente:', error);
        setError('Error al cargar la información del cliente');
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [location.search]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="rounded-lg bg-red-900/50 p-4 border border-red-800">
            <p className="text-red-300">{error || 'No se encontró la información del cliente'}</p>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
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
      <PaymentForm 
        clientId={client.id} 
        clientName={client.name}
        onPaymentComplete={() => navigate('/dashboard')}
        onCancel={() => navigate('/dashboard')}
      />
    </div>
  );
};

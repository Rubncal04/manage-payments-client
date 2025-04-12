import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Client } from '../../core/domain/Client';
import { clientService } from '../../core/services/clientService';

export const HomePage = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await clientService.getAllClients();
        // Si la respuesta es null, inicializamos con un array vacío
        setClients(clientsData || []);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="rounded-lg bg-red-900/50 p-4 border border-red-800">
            <p className="text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-300">Clientes</h1>
        <button
          onClick={() => navigate('/clients/new')}
          className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
        >
          Nuevo Cliente
        </button>
      </div>
      
      {clients.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-800/50 rounded-lg p-8">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">No hay clientes</h3>
            <p className="mt-1 text-sm text-gray-400">
              Comienza agregando tu primer cliente para gestionar sus pagos de YouTube Premium.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/clients/new')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Agregar Cliente
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-gray-800 shadow rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-300">{client.name}</h3>
                  <p className="text-gray-400">{client.cell_phone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  client.status === 'active' 
                    ? 'bg-green-900/50 text-green-300 border border-green-800'
                    : 'bg-red-900/50 text-red-300 border border-red-800'
                }`}>
                  {client.status === 'active' ? 'Al día' : 'Pendiente'}
                </span>
              </div>
              
              <div className="space-y-2 mb-6">
                <p className="text-gray-400">
                  <span className="font-medium text-gray-300">Día de pago:</span> {client.day_to_pay}
                </p>
                <p className="text-gray-400">
                  <span className="font-medium text-gray-300">Teléfono:</span> {client.cell_phone}
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => navigate(`/clients/${client.id}`)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Ver detalles
                </button>
                {client.status === 'inactive' && (
                  <button
                    onClick={() => navigate(`/payments/new?clientId=${client.id}`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    Registrar Pago
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

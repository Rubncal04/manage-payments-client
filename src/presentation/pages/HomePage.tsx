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
        setClients(clientsData);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => navigate('/clients/new')}
          className="btn btn-primary"
        >
          Nuevo Cliente
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map(client => (
          <div key={client.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{client.name}</h3>
                <p className="text-gray-600">{client.cell_phone}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                client.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {client.status === 'active' ? 'Al día' : 'Pendiente'}
              </span>
            </div>
            
            <div className="space-y-2 mb-6">
              <p className="text-gray-700">
                <span className="font-medium">Día de pago:</span> {client.day_to_pay}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Teléfono:</span> {client.cell_phone}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(`/clients/${client.id}`)}
                className="btn btn-secondary"
              >
                Ver detalles
              </button>
              {client.status === 'inactive' && (
                <button
                  onClick={() => navigate(`/payments/new?clientId=${client.id}`)}
                  className="btn btn-primary"
                >
                  Registrar Pago
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Client } from '../../core/domain/Client';
import { clientService } from '../../core/services/clientService';
import { formatDate } from '../../core/utils/dateUtils';

export const ClientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        if (!id) return;
        const data = await clientService.getClientById(id);
        setClient(data);
      } catch (err) {
        setError('Error al cargar los datos del cliente');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
  if (!client) return <div className="text-center p-4">Cliente no encontrado</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Detalles del Cliente</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="btn btn-secondary"
        >
          Volver
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Información Personal</h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Nombre:</span> {client.name}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Teléfono:</span> {client.cell_phone}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Día de pago:</span> {client.day_to_pay}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Estado:</span>{' '}
                <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                  client.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {client.status === 'active' ? 'Al día' : 'Pendiente'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Información de Pagos</h3>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Último pago:</span>{' '}
                {client.last_payment_date
                  ? formatDate(client.last_payment_date)
                  : 'Sin pagos registrados'}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Fecha de registro:</span>{' '}
                {formatDate(client.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/payments/new?clientId=${client.id}`)}
            className="btn btn-primary"
            disabled={client.status === 'active'}
          >
            Registrar Pago
          </button>
          <button
            onClick={() => navigate(`/clients/${client.id}/edit`)}
            className="btn btn-secondary"
          >
            Editar Cliente
          </button>
        </div>
      </div>
    </div>
  );
}; 
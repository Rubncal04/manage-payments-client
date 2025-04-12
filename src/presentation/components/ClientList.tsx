import { useState, useEffect } from 'react';
import { Client } from '../../core/domain/Client';
import { ClientCard } from './clients/ClientCard';
import { clientService } from '../../core/services/clientService';

interface ClientListProps {
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientList = ({ onEdit, onDelete }: ClientListProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clientService.getAllClients();
        if (Array.isArray(response)) {
          setClients(response);
        } else {
          throw new Error('La respuesta no es un array de clientes');
        }
      } catch (err) {
        setError('Error al cargar los clientes');
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
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
        <div className="text-center text-red-400">
          {error}
        </div>
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center text-gray-400">
          No hay clientes registrados
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

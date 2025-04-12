import { useState, useEffect } from 'react';
import { Client } from '../../core/domain/Client';
import { clientService } from '../../core/services/clientService';

export const useClients = () => {
  const [data, setData] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      const clients = await clientService.getAllClients();
      setData(clients);
    } catch (error) {
      console.error('Error loading clients:', error);
      setIsError(true);
      setError('Error al cargar los clientes');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    clients: {
      data,
      isLoading,
      isError,
      error
    },
    loadClients
  };
}; 
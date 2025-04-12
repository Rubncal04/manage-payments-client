import { useState, useEffect } from 'react';
import { Client } from '../../core/domain/Client';
import { Payment } from '../../core/domain/Payment';
import { clientService } from '../../core/services/clientService';
import { paymentService } from '../../core/services/paymentService';
import { StatisticsCharts } from '../components/statistics/StatisticsCharts';
import { StatisticsAlerts } from '../components/statistics/StatisticsAlerts';
import { StatisticsExport } from '../components/statistics/StatisticsExport';

export const StatisticsPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [clientsData, paymentsData] = await Promise.all([
        clientService.getAllClients(),
        paymentService.getAllPayments()
      ]);
      
      // Si la respuesta es null, inicializamos con un array vacío
      setClients(clientsData || []);
      setPayments(paymentsData || []);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar las estadísticas');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStatistics = () => {
    const activeClients = clients.filter(client => client.status === 'active').length;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const averagePayment = payments.length > 0 ? totalRevenue / payments.length : 0;

    return {
      totalClients: clients.length,
      activeClients,
      inactiveClients: clients.length - activeClients,
      totalPayments: payments.length,
      totalRevenue,
      averagePayment
    };
  };

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center text-red-400">
          {error}
        </div>
      </div>
    );
  }

  const stats = calculateStatistics();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Cargando estadísticas...</p>
          </div>
        </div>
      ) : clients.length > 0 || payments.length > 0 ? (
        <div className="grid gap-6">
          <StatisticsCharts clients={clients} payments={payments} period={selectedPeriod} />
          <StatisticsAlerts clients={clients} payments={payments} />
          <StatisticsExport clients={clients} payments={payments} />
        </div>
      ) : (
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">No hay datos disponibles</h3>
            <p className="mt-1 text-sm text-gray-400">
              Aún no hay clientes o pagos registrados en el sistema.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 
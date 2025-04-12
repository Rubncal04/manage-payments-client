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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [clientsResponse, paymentsResponse] = await Promise.all([
          clientService.getAllClients(),
          paymentService.getAllPayments()
        ]);
        setClients(clientsResponse);
        setPayments(paymentsResponse);
      } catch (err) {
        setError('Error al cargar los datos');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

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
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Estadísticas</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="bg-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="year">Último año</option>
          </select>
          <StatisticsExport clients={clients} payments={payments} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Clientes</h3>
          <p className="text-2xl font-bold text-white">{stats.totalClients}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Clientes Activos</h3>
          <p className="text-2xl font-bold text-green-400">{stats.activeClients}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Total Pagos</h3>
          <p className="text-2xl font-bold text-blue-400">{stats.totalPayments}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-sm font-medium text-gray-400 mb-2">Ingresos Totales</h3>
          <p className="text-2xl font-bold text-purple-400">
            ${stats.totalRevenue.toLocaleString('es-CO')} COP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatisticsCharts clients={clients} payments={payments} period={selectedPeriod} />
        <StatisticsAlerts clients={clients} payments={payments} />
      </div>
    </div>
  );
}; 
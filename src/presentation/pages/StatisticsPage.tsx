import { useState, useEffect } from 'react';
import { Client } from '../../core/domain/Client';
import { Payment } from '../../core/domain/Payment';
import { clientService } from '../../core/services/clientService';
import { paymentService } from '../../core/services/paymentService';
import { StatisticsCharts } from '../components/statistics/StatisticsCharts';
import { StatisticsAlerts } from '../components/statistics/StatisticsAlerts';
import { StatisticsExport } from '../components/statistics/StatisticsExport';

interface Stats {
  totalAmount: number;
  totalPayments: number;
  averageAmount: number;
  clients: Client[];
  payments: Payment[];
}

export const StatisticsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalPayments: 0,
    averageAmount: 0,
    clients: [],
    payments: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const [clientsData, paymentsData] = await Promise.all([
          clientService.getAllClients(),
          paymentService.getAllPayments()
        ]);

        const clients = clientsData || [];
        const payments = paymentsData || [];
        
        const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalPayments = payments.length;
        const averageAmount = totalPayments > 0 ? totalAmount / totalPayments : 0;

        setStats({
          totalAmount,
          totalPayments,
          averageAmount,
          clients,
          payments: payments as Payment[]
        });
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar las estadísticas. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedPeriod]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto bg-red-900/50 border border-red-500 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Estadísticas de Pagos</h1>
          
          <div className="flex gap-4">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
              className="bg-gray-800 text-white border border-gray-700 rounded px-3 py-2"
            >
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
              <option value="year">Este Año</option>
            </select>
            
            <StatisticsExport clients={stats.clients} payments={stats.payments} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total Recaudado</h3>
            <p className="text-2xl font-bold text-white">
              ${stats.totalAmount.toLocaleString()} COP
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Total de Pagos</h3>
            <p className="text-2xl font-bold text-white">
              {stats.totalPayments.toLocaleString()}
            </p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Promedio por Pago</h3>
            <p className="text-2xl font-bold text-white">
              ${Math.round(stats.averageAmount).toLocaleString()} COP
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          <StatisticsCharts clients={stats.clients} payments={stats.payments} period={selectedPeriod} />
          <StatisticsAlerts clients={stats.clients} payments={stats.payments} />
        </div>
      </div>
    </div>
  );
}; 
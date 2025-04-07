import { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { paymentService, Payment } from '../../core/services/paymentService';
import { StatisticsCharts } from '../components/statistics/StatisticsCharts';
import { StatisticsAlerts } from '../components/statistics/StatisticsAlerts';
import { StatisticsExport } from '../components/statistics/StatisticsExport';

interface Statistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalPayments: number;
  totalRevenue: number;
  averagePayment: number;
  paymentsThisMonth: number;
  revenueThisMonth: number;
}

export const StatisticsPage = () => {
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalPayments: 0,
    totalRevenue: 0,
    averagePayment: 0,
    paymentsThisMonth: 0,
    revenueThisMonth: 0
  });
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (users && payments.length > 0) {
      calculateStatistics();
    }
  }, [users, payments]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getAllPayments();
      setPayments(data);
    } catch (err) {
      setError('Error al cargar los pagos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.paid).length;
    const inactiveUsers = totalUsers - activeUsers;

    const totalPayments = payments.length;
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const averagePayment = totalPayments > 0 ? totalRevenue / totalPayments : 0;

    const paymentsThisMonth = payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
    }).length;

    const revenueThisMonth = payments
      .filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    setStatistics({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalPayments,
      totalRevenue,
      averagePayment,
      paymentsThisMonth,
      revenueThisMonth
    });
  };

  if (loading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || usersError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">
            {error || (usersError && usersError.message)}
          </p>
          <button
            onClick={loadPayments}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Estadísticas</h1>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Todos los períodos</option>
          <option value="month">Este mes</option>
          <option value="year">Este año</option>
        </select>
      </div>

      {/* Panel de Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Total de Usuarios</h3>
          <p className="text-3xl font-bold text-blue-400">{statistics.totalUsers}</p>
          <div className="mt-2 text-sm text-gray-400">
            <p>Activos: {statistics.activeUsers}</p>
            <p>Inactivos: {statistics.inactiveUsers}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Total de Pagos</h3>
          <p className="text-3xl font-bold text-green-400">{statistics.totalPayments}</p>
          <div className="mt-2 text-sm text-gray-400">
            <p>Este mes: {statistics.paymentsThisMonth}</p>
            <p>Promedio: ${statistics.averagePayment.toLocaleString('es-CO')} COP</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-purple-400">
            ${statistics.totalRevenue.toLocaleString('es-CO')} COP
          </p>
          <div className="mt-2 text-sm text-gray-400">
            <p>Este mes: ${statistics.revenueThisMonth.toLocaleString('es-CO')} COP</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-2">Tasa de Conversión</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {((statistics.activeUsers / statistics.totalUsers) * 100).toFixed(1)}%
          </p>
          <div className="mt-2 text-sm text-gray-400">
            <p>Usuarios activos</p>
            <p>de {statistics.totalUsers} totales</p>
          </div>
        </div>
      </div>

      {/* Alertas y Notificaciones */}
      <div className="mb-12">
        <StatisticsAlerts 
          users={users} 
          payments={payments} 
          selectedPeriod={selectedPeriod}
        />
      </div>

      {/* Gráficos */}
      <div className="mb-12">
        <StatisticsCharts
          payments={payments}
          users={users}
          selectedPeriod={selectedPeriod}
        />
      </div>

      {/* Exportación de Datos */}
      <StatisticsExport users={users} payments={payments} />
    </div>
  );
}; 
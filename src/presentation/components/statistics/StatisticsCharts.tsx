import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Payment } from '../../../core/services/paymentService';
import { User } from '../../../core/domain/User';
import { formatDate } from '../../../core/utils/dateUtils';

interface StatisticsChartsProps {
  payments: Payment[];
  users: User[];
  selectedPeriod: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const StatisticsCharts = ({ payments, users, selectedPeriod }: StatisticsChartsProps) => {
  // Procesar datos para el gráfico de pagos mensuales
  const processMonthlyPayments = () => {
    const monthlyData = payments.reduce((acc: any, payment) => {
      const date = new Date(payment.payment_date);
      const monthKey = formatDate(payment.payment_date, { month: 'long', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          name: monthKey,
          pagos: 0,
          ingresos: 0
        };
      }
      
      acc[monthKey].pagos++;
      acc[monthKey].ingresos += payment.amount;
      
      return acc;
    }, {});

    return Object.values(monthlyData);
  };

  // Procesar datos para el gráfico de distribución de usuarios
  const processUserDistribution = () => {
    const activeUsers = users.filter(user => user.paid).length;
    const inactiveUsers = users.filter(user => !user.paid).length;

    return [
      { name: 'Activos', value: activeUsers },
      { name: 'Inactivos', value: inactiveUsers }
    ];
  };

  // Procesar datos para el gráfico de tendencia de ingresos
  const processRevenueTrend = () => {
    const dailyData = payments.reduce((acc: any, payment) => {
      const date = formatDate(payment.payment_date, { month: 'long', day: 'numeric' });
      
      if (!acc[date]) {
        acc[date] = {
          name: date,
          ingresos: 0
        };
      }
      
      acc[date].ingresos += payment.amount;
      
      return acc;
    }, {});

    return Object.values(dailyData);
  };

  // Procesar datos para el gráfico de días de pago
  const processPaymentDays = () => {
    const daysData = payments.reduce((acc: any, payment) => {
      const date = new Date(payment.payment_date);
      const dayKey = formatDate(payment.payment_date, { weekday: 'long' });
      
      if (!acc[dayKey]) {
        acc[dayKey] = {
          name: dayKey,
          pagos: 0
        };
      }
      
      acc[dayKey].pagos++;
      
      return acc;
    }, {});

    return Object.values(daysData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Gráfico de Pagos Mensuales */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Pagos por Mes</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processMonthlyPayments()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="pagos" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Distribución de Usuarios */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Distribución de Usuarios</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processUserDistribution()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {processUserDistribution().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Tendencia de Ingresos */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Tendencia de Ingresos</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processRevenueTrend()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line type="monotone" dataKey="ingresos" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Días de Pago */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Pagos por Día</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processPaymentDays()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Bar dataKey="pagos" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 
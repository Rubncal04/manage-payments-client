import { Client } from '../../../core/domain/Client';
import { Payment } from '../../../core/domain/Payment';
import { PieChart, LineChart, BarChart, Pie, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatisticsChartsProps {
  clients: Client[];
  payments: Payment[];
  period: 'week' | 'month' | 'year';
}

export const StatisticsCharts = ({ clients, payments, period }: StatisticsChartsProps) => {
  const processMonthlyPayments = () => {
    const monthlyData = new Map<string, number>();
    payments.forEach(payment => {
      const date = new Date(payment.payment_date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(month, (monthlyData.get(month) || 0) + 1);
    });
    return Array.from(monthlyData.entries()).map(([month, count]) => ({
      month,
      count
    }));
  };

  const processUserDistribution = () => {
    const active = clients.filter(client => client.status === 'active').length;
    const inactive = clients.length - active;
    return [
      { name: 'Activos', value: active, fill: '#10B981' },
      { name: 'Inactivos', value: inactive, fill: '#EF4444' }
    ];
  };

  const processRevenueTrend = () => {
    const monthlyData = new Map<string, number>();
    payments.forEach(payment => {
      const date = new Date(payment.payment_date);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData.set(month, (monthlyData.get(month) || 0) + payment.amount);
    });
    return Array.from(monthlyData.entries()).map(([month, amount]) => ({
      month,
      amount
    }));
  };

  const processPaymentDays = () => {
    const dayCounts = new Map<string, number>();
    clients.forEach(client => {
      const day = String(client.day_to_pay);
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
    });
    return Array.from(dayCounts.entries()).map(([day, count]) => ({
      day,
      count
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Distribución de Clientes</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processUserDistribution()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }} />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Tendencia de Ingresos</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={processRevenueTrend()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Días de Pago</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processPaymentDays()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend wrapperStyle={{ color: '#9CA3AF' }} />
              <Bar dataKey="count" fill="#8B5CF6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 
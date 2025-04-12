import { Client } from '../../../core/domain/Client';
import { Payment } from '../../../core/domain/Payment';
import { ExclamationTriangleIcon, BellAlertIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';

interface StatisticsAlertsProps {
  clients: Client[];
  payments: Payment[];
}

export const StatisticsAlerts = ({ clients, payments }: StatisticsAlertsProps) => {
  const getUpcomingPayments = () => {
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);

    return clients.filter(client => {
      const paymentDate = new Date();
      paymentDate.setDate(Number(client.day_to_pay));
      return paymentDate >= today && paymentDate <= threeDaysFromNow;
    });
  };

  const getOverduePayments = () => {
    const today = new Date();
    return clients.filter(client => {
      const paymentDate = new Date();
      paymentDate.setDate(Number(client.day_to_pay));
      return paymentDate < today && client.status === 'inactive';
    });
  };

  const checkPaymentTrend = () => {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const lastMonthPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate >= lastMonth && paymentDate < currentMonth;
    });

    const currentMonthPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      return paymentDate >= currentMonth;
    });

    return currentMonthPayments.length < lastMonthPayments.length;
  };

  const upcomingPayments = getUpcomingPayments();
  const overduePayments = getOverduePayments();
  const isNegativeTrend = checkPaymentTrend();

  return (
    <div className="space-y-6">
      {/* Próximos Pagos */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <BellAlertIcon className="h-6 w-6 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Próximos Pagos</h3>
        </div>
        {upcomingPayments.length > 0 ? (
          <ul className="space-y-2">
            {upcomingPayments.map(client => (
              <li key={client.id} className="flex justify-between items-center">
                <span className="text-gray-300">{client.name}</span>
                <span className="text-sm text-gray-400">
                  Día {client.day_to_pay}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No hay pagos próximos</p>
        )}
      </div>

      {/* Pagos Atrasados */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Pagos Atrasados</h3>
        </div>
        {overduePayments.length > 0 ? (
          <ul className="space-y-2">
            {overduePayments.map(client => (
              <li key={client.id} className="flex justify-between items-center">
                <span className="text-gray-300">{client.name}</span>
                <span className="text-sm text-red-400">
                  Día {client.day_to_pay}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No hay pagos atrasados</p>
        )}
      </div>

      {/* Tendencia de Pagos */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3 mb-4">
          <ArrowTrendingDownIcon className="h-6 w-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Tendencia de Pagos</h3>
        </div>
        <p className={isNegativeTrend ? 'text-red-400' : 'text-green-400'}>
          {isNegativeTrend
            ? 'Los pagos han disminuido este mes'
            : 'Los pagos se mantienen estables'}
        </p>
      </div>
    </div>
  );
};

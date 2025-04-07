import { User } from '../../../core/domain/User';
import { Payment } from '../../../core/services/paymentService';
import { BellIcon, ExclamationTriangleIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { formatDate } from '../../../core/utils/dateUtils';

interface StatisticsAlertsProps {
  users: User[];
  payments: Payment[];
  selectedPeriod: string;
}

export const StatisticsAlerts = ({ users, payments, selectedPeriod }: StatisticsAlertsProps) => {
  const today = new Date();
  const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  const getPaymentDate = (dayOfMonth: string) => {
    const date = new Date();
    const day = parseInt(dayOfMonth, 10);
    
    // Si el día actual es mayor que el día de pago, la próxima fecha de pago es el mes siguiente
    if (today.getDate() > day) {
      date.setMonth(date.getMonth() + 1);
    }
    
    date.setDate(day);
    // Establecer la hora a medianoche para comparaciones consistentes
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const filterByPeriod = (date: Date) => {
    if (selectedPeriod === 'month') {
      return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    } else if (selectedPeriod === 'year') {
      return date.getFullYear() === today.getFullYear();
    }
    return true; // 'all'
  };

  // Usuarios con pagos próximos (en los próximos 3 días)
  const upcomingPayments = users.filter(user => {
    const paymentDate = getPaymentDate(user.date_to_pay);
    return paymentDate >= today && 
           paymentDate <= threeDaysFromNow && 
           !user.paid && 
           filterByPeriod(paymentDate);
  });

  // Usuarios con pagos vencidos
  const overduePayments = users.filter(user => {
    const paymentDate = getPaymentDate(user.date_to_pay);
    // Si la fecha de pago es anterior a hoy y no ha pagado
    return paymentDate < today && !user.paid && filterByPeriod(paymentDate);
  });

  // Comparar pagos del mes actual con el mes anterior
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentMonthPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    return filterByPeriod(paymentDate);
  });

  const lastMonthPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.payment_date);
    if (selectedPeriod === 'month') {
      return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastYear;
    } else if (selectedPeriod === 'year') {
      return paymentDate.getFullYear() === lastYear;
    }
    return paymentDate.getMonth() === lastMonth && paymentDate.getFullYear() === lastYear;
  });

  const isNegativeTrend = currentMonthPayments.length < lastMonthPayments.length;

  const formatPaymentDay = (dayOfMonth: string) => {
    const date = getPaymentDate(dayOfMonth);
    return formatDate(date.toISOString(), { day: 'numeric', month: 'long' });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Alertas de Pagos Próximos */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Pagos Próximos</h3>
          <BellIcon className="h-6 w-6 text-yellow-400" />
        </div>
        {upcomingPayments.length > 0 ? (
          <ul className="space-y-2">
            {upcomingPayments.map(user => (
              <li key={user.id} className="text-gray-300">
                {user.name} - {formatPaymentDay(user.date_to_pay)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No hay pagos próximos</p>
        )}
      </div>

      {/* Alertas de Pagos Vencidos */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Pagos Vencidos</h3>
          <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
        </div>
        {overduePayments.length > 0 ? (
          <ul className="space-y-2">
            {overduePayments.map(user => (
              <li key={user.id} className="text-gray-300">
                {user.name} - {formatPaymentDay(user.date_to_pay)}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No hay pagos vencidos</p>
        )}
      </div>

      {/* Tendencias */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Tendencias</h3>
          <ChartBarIcon className="h-6 w-6 text-blue-400" />
        </div>
        <div className="space-y-2">
          <p className="text-gray-300">
            Pagos este mes: {currentMonthPayments.length}
          </p>
          <p className="text-gray-300">
            Pagos mes anterior: {lastMonthPayments.length}
          </p>
          <p className={`font-semibold ${isNegativeTrend ? 'text-red-400' : 'text-green-400'}`}>
            {isNegativeTrend ? 'Tendencia negativa' : 'Tendencia positiva'}
          </p>
        </div>
      </div>
    </div>
  );
}; 
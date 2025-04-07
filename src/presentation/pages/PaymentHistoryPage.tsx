import { useState, useEffect } from 'react';
import { Payment, paymentService } from '../../core/services/paymentService';
import { User } from '../../core/services/userService';

interface PaymentWithUser extends Payment {
  user?: User;
}

export const PaymentHistoryPage = () => {
  const [payments, setPayments] = useState<PaymentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setError(null);
      const allPayments = await paymentService.getAllPayments();
      setPayments(allPayments);
    } catch (error) {
      console.error('Error al cargar el historial de pagos:', error);
      setError('Error al cargar el historial de pagos');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filterPayments = (payments: PaymentWithUser[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return payments.filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      switch (filter) {
        case 'today':
          return paymentDate >= today;
        case 'week':
          return paymentDate >= weekAgo;
        case 'month':
          return paymentDate >= monthAgo;
        default:
          return true;
      }
    });
  };

  const filteredPayments = filterPayments(payments);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Historial de Pagos</h1>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos</option>
            <option value="today">Hoy</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mes</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredPayments.length > 0 ? (
        <div className="grid gap-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-gray-800 rounded-lg p-6 shadow-lg"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">
                    ${payment.amount.toLocaleString('es-CO')} COP
                  </p>
                  <p className="text-gray-400 text-sm">
                    {formatDate(payment.payment_date)}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs font-medium bg-green-900 text-green-300 rounded-full">
                  Completado
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">No hay pagos registrados</p>
        </div>
      )}
    </div>
  );
}; 
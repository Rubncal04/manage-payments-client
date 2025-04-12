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
      setPayments(allPayments || []);
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
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Cargando historial de pagos...</p>
          </div>
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-300">No hay pagos registrados</h3>
            <p className="mt-1 text-sm text-gray-400">
              Aún no se han registrado pagos en el sistema.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}; 
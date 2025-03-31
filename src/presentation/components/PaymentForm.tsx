import { useState, useEffect } from 'react';
import { User } from '../../core/domain/User';
import { Payment, paymentService } from '../../core/services/paymentService';

interface PaymentFormProps {
  user: User;
  onPaymentComplete: () => void;
}

export const PaymentForm = ({ user, onPaymentComplete }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPayments();
  }, [user.id]);

  const loadPayments = async () => {
    try {
      setError(null);
      const userPayments = await paymentService.getPaymentsByUser(user.id);
      setPayments(userPayments || []);
    } catch (error) {
      console.error('Error al cargar el historial de pagos:', error);
      setError('Error al cargar el historial de pagos');
      setPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setError(null);

    try {
      await paymentService.createPayment(user.id);
      setPaymentStatus('success');
      // Recargar el historial de pagos
      await loadPayments();
      // Esperar un momento para mostrar el éxito
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPaymentComplete();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setPaymentStatus('error');
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
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

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Pago de YouTube Premium</h2>
      
      <div className="mb-6 p-4 bg-gray-700 rounded-lg">
        <p className="text-gray-300 text-sm">Usuario: {user.name}</p>
        <p className="text-gray-300 text-sm">Monto: $8.500 COP</p>
        <p className="text-gray-300 text-sm">Plan: Premium Individual</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Procesando pago...
            </>
          ) : paymentStatus === 'success' ? (
            '¡Pago completado!'
          ) : paymentStatus === 'error' ? (
            'Error en el pago. Intentar de nuevo'
          ) : (
            'Pagar $8.500 COP'
          )}
        </button>

        {paymentStatus === 'success' && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-lg">
            <p className="text-green-400 text-sm">
              ¡Pago procesado exitosamente! Tu suscripción de YouTube Premium ha sido activada.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-white mb-4">Historial de Pagos</h3>
        {isLoadingPayments ? (
          <div className="flex justify-center items-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : payments.length > 0 ? (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 bg-gray-700 rounded-lg flex justify-between items-center"
              >
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
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-4">
            No hay historial de pagos
          </p>
        )}
      </div>
    </div>
  );
}; 
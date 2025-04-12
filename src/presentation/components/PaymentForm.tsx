import { useState, useEffect, useRef } from 'react';
import { paymentService, Payment } from '../../core/services/paymentService';

interface PaymentFormProps {
  clientId: string;
  clientName: string;
  onPaymentComplete: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({ 
  clientId, 
  clientName,
  onPaymentComplete,
  onCancel 
}: PaymentFormProps) => {
  const [amount, setAmount] = useState<number>(8500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'completed' | 'failed'>('idle');
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const pollingInterval = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  const startPollingPaymentStatus = (paymentId: string) => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }

    const pollStatus = async () => {
      try {
        const payment = await paymentService.getPaymentStatus(clientId, paymentId);
        setCurrentPayment(payment);

        if (payment.status === 'completed') {
          clearInterval(pollingInterval.current);
          setPaymentStatus('completed');
          setTimeout(() => {
            onPaymentComplete();
          }, 2000);
        } else if (payment.status === 'failed') {
          clearInterval(pollingInterval.current);
          setPaymentStatus('failed');
          setError('El pago no pudo ser procesado. Por favor, intenta nuevamente.');
          setShowConfirmation(false);
        }
      } catch (error: any) {
        console.error('Error al verificar estado del pago:', error);
        clearInterval(pollingInterval.current);
        setPaymentStatus('failed');
        setError(
          error.response?.data?.message || 
          error.message || 
          'Error al verificar el estado del pago. Por favor, intenta nuevamente.'
        );
        setShowConfirmation(false);
      }
    };

    // Poll every 2 seconds
    pollingInterval.current = setInterval(pollStatus, 2000);
    // Initial check
    pollStatus();
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    setPaymentStatus('processing');

    try {
      const paymentData = {
        client_id: clientId,
        amount: amount
      };
      
      const response = await paymentService.createPayment(paymentData);
      setCurrentPayment(response);
      
      if (response.status === 'processing') {
        startPollingPaymentStatus(response.id);
      } else if (response.status === 'completed') {
        setPaymentStatus('completed');
        setTimeout(() => {
          onPaymentComplete();
        }, 2000);
      } else {
        setPaymentStatus('failed');
        setError('El pago no pudo ser procesado. Por favor, intenta nuevamente.');
        setShowConfirmation(false);
      }
    } catch (error: any) {
      console.error('Error al procesar el pago:', error);
      setPaymentStatus('failed');
      setError(
        error.response?.data?.message || 
        error.message || 
        'Error al procesar el pago. Por favor, intenta nuevamente.'
      );
      setShowConfirmation(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const validatePayment = () => {
    if (amount < 8500) {
      setError('El monto mínimo de pago es $8,500 COP');
      return false;
    }
    if (amount > 100000) {
      setError('El monto máximo de pago es $100,000 COP');
      return false;
    }
    return true;
  };

  const handleConfirmPayment = () => {
    if (!validatePayment()) return;
    setShowConfirmation(true);
    setError(null);
  };

  if (showConfirmation) {
    return (
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-6">
          {paymentStatus === 'completed' ? 'Pago Exitoso' : 'Confirmar Pago'}
        </h2>
        
        <div className="mb-6 space-y-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-300 mb-2">Cliente:</p>
            <p className="text-white font-medium">{clientName}</p>
          </div>
          
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-300 mb-2">Monto a pagar:</p>
            <p className="text-white font-medium">${amount.toLocaleString()} COP</p>
          </div>

          {paymentStatus === 'processing' && (
            <div className="bg-blue-900/50 border border-blue-500 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
                <p className="text-blue-300">Procesando el pago...</p>
              </div>
              {currentPayment && (
                <div className="text-sm text-blue-300">
                  <p>ID de Transacción: {currentPayment.id}</p>
                  <p>Fecha: {new Date(currentPayment.created_at).toLocaleString()}</p>
                </div>
              )}
            </div>
          )}

          {paymentStatus === 'completed' && currentPayment && (
            <div className="bg-green-900/50 border border-green-500 rounded-lg p-4">
              <p className="text-green-300 mb-2">¡El pago se ha procesado exitosamente!</p>
              <div className="text-sm text-green-300">
                <p>ID de Transacción: {currentPayment.id}</p>
                <p>Fecha de Pago: {new Date(currentPayment.payment_date).toLocaleString()}</p>
                <p>Estado: Completado</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          {paymentStatus === 'idle' && (
            <>
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : (
                  'Confirmar Pago'
                )}
              </button>

              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setError(null);
                }}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Cancelar
              </button>
            </>
          )}

          {paymentStatus === 'failed' && (
            <button
              onClick={() => {
                setPaymentStatus('idle');
                setShowConfirmation(false);
                setError(null);
              }}
              className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Intentar Nuevamente
            </button>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Registrar Pago</h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-6">
        <div className="mb-4">
          <p className="text-gray-300 text-sm">Cliente:</p>
          <p className="text-white font-medium">{clientName}</p>
        </div>

        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Monto del pago
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => {
            setAmount(Number(e.target.value));
            setError(null);
          }}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="8500"
          max="100000"
          step="100"
        />
        <p className="mt-2 text-sm text-gray-400">
          El monto mínimo es $8,500 COP y el máximo es $100,000 COP
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={handleConfirmPayment}
          disabled={isProcessing || amount < 8500}
          className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          Continuar
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

import { useState } from 'react';
import { paymentService } from '../../core/services/paymentService';

interface PaymentFormProps {
  clientId: string;
  onPaymentComplete: () => void;
}

export const PaymentForm = ({ clientId, onPaymentComplete }: PaymentFormProps) => {
  const [amount, setAmount] = useState<number>(8500);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const paymentData = {
        client_id: clientId,
        amount: amount
      };
      
      await paymentService.createPayment(paymentData);
      onPaymentComplete();
    } catch (error) {
      console.error('Error al procesar el pago:', error);
      setError('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Registrar Pago de YouTube Premium</h2>
      
      <div className="mb-6">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
          Monto del pago
        </label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step="100"
        />
      </div>

      <div className="space-y-4">
        <button
          onClick={handlePayment}
          disabled={isProcessing || amount <= 0}
          className="w-full px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Procesando pago...
            </>
          ) : (
            `Registrar Pago de $${amount.toLocaleString()} COP`
          )}
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
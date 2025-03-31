import { useParams, useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { PaymentForm } from '../components/PaymentForm';

export const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { users } = useUsers();

  const user = users.data?.find(u => u.id === id);

  if (users.isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando información del usuario...</p>
        </div>
      </div>
    );
  }

  if (users.isError || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400">No se encontró el usuario</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const handlePaymentComplete = () => {
    // Aquí podrías actualizar el estado del usuario en la base de datos
    // Por ahora solo redirigimos
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PaymentForm user={user} onPaymentComplete={handlePaymentComplete} />
    </div>
  );
};

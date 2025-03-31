import { User } from '../../core/domain/User';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  user: User;
  onDelete: (id: string) => void;
}

export const UserCard = ({ user, onDelete }: UserCardProps) => {
  const navigate = useNavigate();

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      onDelete(user.id);
    }
  };

  const handlePayment = () => {
    navigate(`/payment/${user.id}`);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-white">{user.name}</h3>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-2 mb-6">
        <p className="text-gray-300">
          <span className="font-medium">Teléfono:</span> {user.cell_phone || 'No especificado'}
        </p>
        <p className="text-gray-300">
          <span className="font-medium">Día de pago:</span> {user.date_to_pay}
        </p>
        <p className="text-gray-300">
          <span className="font-medium">Estado:</span>{' '}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.paid 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {user.paid ? 'Activo' : 'Inactivo'}
          </span>
        </p>
      </div>

      <div className="flex justify-end space-x-3">
        {!user.paid && (
          <button
            onClick={handlePayment}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Realizar Pago
          </button>
        )}
      </div>
    </div>
  );
}; 
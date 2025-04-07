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
      onDelete(user.id!);
    }
  };

  const handlePayment = () => {
    navigate(`/payment/${user.id}`);
  };

  // Obtener la inicial del nombre
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 border border-gray-700 h-full">
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar con inicial */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-xl font-bold text-white">
          {getInitial(user.name)}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-white tracking-wide truncate">{user.name}</h3>
        </div>

        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition-all duration-200 transform hover:scale-110 flex-shrink-0"
          aria-label="Eliminar usuario"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
          </svg>
          <div className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-300">Teléfono:</span>
            <span className="text-gray-400">{user.cell_phone || 'No especificado'}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
          <div className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-300">Día de pago:</span>
            <span className="text-gray-400">{user.date_to_pay}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-.75-7.25a.75.75 0 000 1.5h2.5a.75.75 0 000-1.5h-2.5z" clipRule="evenodd" />
          </svg>
          <div className="flex justify-between items-center w-full">
            <span className="font-medium text-gray-300">Estado:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              user.paid 
                ? 'bg-green-500/10 text-green-400 ring-1 ring-green-400/20' 
                : 'bg-red-500/10 text-red-400 ring-1 ring-red-400/20'
            }`}>
              {user.paid ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
      </div>

      {!user.paid && (
        <div className="relative">
          <button
            onClick={handlePayment}
            className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Realizar Pago
          </button>
        </div>
      )}
    </div>
  );
}; 
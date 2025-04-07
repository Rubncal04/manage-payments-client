import { UserList } from '../components/UserList';
import { useUsers } from '../../hooks/useUsers';
import { User } from '../../core/domain/User';
import { formatDate } from '../../core/utils/dateUtils';

export const HomePage = () => {
  const { users, loading, error } = useUsers();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-4">
          Gestión de YouTube Premium Family
        </h1>
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Próximos Pagos
          </h2>
          {loading ? (
            <p className="text-gray-400">Cargando próximos pagos...</p>
          ) : error ? (
            <p className="text-red-400">Error al cargar próximos pagos: {error.message}</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400">No hay usuarios registrados</p>
          ) : (
            <div className="space-y-4">
              {users
                .filter(user => !user.paid)
                .map((user: User) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-gray-400">
                        Próximo pago: {formatDate(user.date_to_pay, { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-white">${user.last_payment_date ? 'Pagado' : 'Pendiente'}</p>
                      <p className="text-sm text-gray-400">{user.cell_phone}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">
          Lista de Usuarios
        </h2>
        <UserList />
      </div>
    </div>
  );
}; 
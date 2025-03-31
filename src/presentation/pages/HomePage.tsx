import { UserList } from '../components/UserList';
import { useUsers } from '../hooks/useUsers';

export const HomePage = () => {
  const { getUpcomingPayments } = useUsers();
  const upcomingPayments = getUpcomingPayments;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Gestión de YouTube Premium Family
        </h1>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Próximos Pagos
          </h2>
          {upcomingPayments.isLoading ? (
            <p className="text-gray-500">Cargando próximos pagos...</p>
          ) : upcomingPayments.isError ? (
            <p className="text-red-500">Error al cargar próximos pagos</p>
          ) : (
            <div className="space-y-4">
              {upcomingPayments.data?.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      Próximo pago: {new Date(user.nextPaymentDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${user.amount}</p>
                    <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Lista de Usuarios
        </h2>
        <UserList />
      </div>
    </div>
  );
}; 
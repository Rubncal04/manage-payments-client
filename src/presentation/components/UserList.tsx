import { User } from '../../core/domain/User';
import { useUsers } from '../../hooks/useUsers';
import { UserCard } from './UserCard';

export const UserList = () => {
  const { users, loading, error, deleteUser } = useUsers();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center text-red-400">
          Error al cargar usuarios: {error.message}
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center text-gray-400">
          No hay usuarios registrados
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {users.map((user: User) => (
        <UserCard
          key={user.id}
          user={user}
          onDelete={(id) => deleteUser.mutate(id)}
        />
      ))}
    </div>
  );
}; 
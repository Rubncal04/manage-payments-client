import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, CreateUserDTO, UpdateUserDTO } from '../core/domain/User';
import { userService } from '../core/services/userService';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  createUser: ReturnType<typeof useMutation<User, Error, CreateUserDTO>>;
  updateUser: ReturnType<typeof useMutation<User, Error, { id: string; user: UpdateUserDTO }>>;
  deleteUser: ReturnType<typeof useMutation<void, Error, string>>;
}

export const useUsers = (): UseUsersReturn => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAllUsers(),
  });

  const createUser = useMutation({
    mutationFn: (user: CreateUserDTO) => userService.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UpdateUserDTO }) =>
      userService.updateUser(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return {
    users: usersQuery.data || [],
    loading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser,
    updateUser,
    deleteUser,
  };
}; 
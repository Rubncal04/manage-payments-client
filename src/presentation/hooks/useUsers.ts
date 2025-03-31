import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { CreateUserDTO, UpdateUserDTO } from '../../core/domain/User';

const userRepository = new UserRepository();

export const useUsers = () => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ['users'],
    queryFn: () => userRepository.getAll(),
  });

  const createUser = useMutation({
    mutationFn: (user: CreateUserDTO) => userRepository.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const updateUser = useMutation({
    mutationFn: ({ id, user }: { id: string; user: UpdateUserDTO }) =>
      userRepository.update(id, user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (id: string) => userRepository.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const getUsersByStatus = (status: 'pending' | 'paid' | 'overdue') => {
    return useQuery({
      queryKey: ['users', 'status', status],
      queryFn: () => userRepository.getByPaymentStatus(status),
    });
  };

  const getUpcomingPayments = useQuery({
    queryKey: ['users', 'upcoming-payments'],
    queryFn: () => userRepository.getUsersWithUpcomingPayments(),
  });

  return {
    users,
    createUser,
    updateUser,
    deleteUser,
    getUsersByStatus,
    getUpcomingPayments,
  };
}; 
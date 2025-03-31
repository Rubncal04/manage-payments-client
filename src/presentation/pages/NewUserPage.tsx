import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import { CreateUserDTO } from '../../core/domain/User';

const schema = yup.object().shape({
  Name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  CellPhone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
  DateToPay: yup
    .string()
    .required('El día de pago es requerido')
    .matches(/^([1-9]|[12][0-9]|3[01])$/, 'El día debe estar entre 1 y 31'),
});

export const NewUserPage = () => {
  const navigate = useNavigate();
  const { createUser } = useUsers();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserDTO>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CreateUserDTO) => {
    try {
      await createUser.mutateAsync(data);
      navigate('/');
    } catch (error) {
      console.error('Error al crear usuario:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-8">Crear Nuevo Usuario</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="Name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="Name"
            {...register('Name')}
            className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="Ingresa el nombre completo"
          />
          {errors.Name && (
            <p className="mt-2 text-sm text-red-400">{errors.Name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="CellPhone" className="block text-sm font-medium text-gray-300 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="CellPhone"
            {...register('CellPhone')}
            className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="1234567890"
          />
          {errors.CellPhone && (
            <p className="mt-2 text-sm text-red-400">{errors.CellPhone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="DateToPay" className="block text-sm font-medium text-gray-300 mb-2">
            Día de Pago
          </label>
          <input
            type="number"
            id="DateToPay"
            min="1"
            max="31"
            {...register('DateToPay')}
            className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="15"
          />
          {errors.DateToPay && (
            <p className="mt-2 text-sm text-red-400">{errors.DateToPay.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={createUser.isPending}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {createUser.isPending ? 'Creando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}; 
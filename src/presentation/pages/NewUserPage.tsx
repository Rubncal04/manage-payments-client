import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { userService } from '../../core/services/userService';

const schema = yup.object().shape({
  name: yup
    .string()
    .required('El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres'),
  cell_phone: yup
    .string()
    .required('El teléfono es requerido')
    .matches(/^[0-9]{10}$/, 'El teléfono debe tener 10 dígitos'),
  date_to_pay: yup
    .string()
    .required('El día de pago es requerido')
    .matches(/^([1-9]|[12][0-9]|3[01])$/, 'El día debe estar entre 1 y 31'),
});

type FormData = {
  name: string;
  cell_phone: string;
  date_to_pay: string;
};

export const NewUserPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      await userService.createUser(data);
      navigate('/');
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setError('Error al crear usuario. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-white mb-8">Crear Nuevo Usuario</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="Ingresa el nombre completo"
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="cell_phone" className="block text-sm font-medium text-gray-300 mb-2">
            Teléfono
          </label>
          <input
            type="tel"
            id="cell_phone"
            {...register('cell_phone')}
            className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="1234567890"
          />
          {errors.cell_phone && (
            <p className="mt-2 text-sm text-red-400">{errors.cell_phone.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="date_to_pay" className="block text-sm font-medium text-gray-300 mb-2">
            Día de Pago
          </label>
          <input
            type="number"
            id="date_to_pay"
            min="1"
            max="31"
            {...register('date_to_pay')}
            className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200"
            placeholder="15"
          />
          {errors.date_to_pay && (
            <p className="mt-2 text-sm text-red-400">{errors.date_to_pay.message}</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

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
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? 'Creando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}; 
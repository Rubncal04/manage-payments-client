import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { CreateClientDTO } from '../../core/domain/Client';
import { clientService } from '../../core/services/clientService';

const schema = yup.object({
  name: yup.string().required('El nombre es requerido'),
  cell_phone: yup.string()
    .matches(/^[0-9]+$/, 'El teléfono solo debe contener números')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .required('El teléfono es requerido'),
  day_to_pay: yup.number()
    .min(1, 'El día debe ser mayor o igual a 1')
    .max(31, 'El día debe ser menor o igual a 31')
    .required('El día de pago es requerido'),
}).required();

export const CreateClientPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateClientDTO>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: CreateClientDTO) => {
    try {
      setLoading(true);
      setError(null);
      await clientService.createClient(data);
      navigate('/dashboard');
    } catch (err) {
      setError('Error al crear el cliente. Por favor, intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-gray-600 hover:text-gray-800"
        >
          Volver
        </button>
      </div>

      <div className="bg-gray-800 shadow-sm rounded-lg p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Nombre
            </label>
            <input
              type="text"
              {...register('name')}
              className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-700 transition-all duration-200 placeholder-gray-400"
              placeholder="Nombre del cliente"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="cell_phone" className="block text-sm font-medium text-gray-300">
              Teléfono
            </label>
            <input
              type="tel"
              {...register('cell_phone')}
              className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-700 transition-all duration-200 placeholder-gray-400"
              placeholder="Número de teléfono"
            />
            {errors.cell_phone && (
              <p className="mt-1 text-sm text-red-400">{errors.cell_phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="day_to_pay" className="block text-sm font-medium text-gray-300">
              Día de pago
            </label>
            <input
              type="number"
              min="1"
              max="31"
              {...register('day_to_pay', { valueAsNumber: true })}
              className="mt-1 block w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-gray-700 transition-all duration-200 placeholder-gray-400"
              placeholder="Día del mes (1-31)"
            />
            {errors.day_to_pay && (
              <p className="mt-1 text-sm text-red-400">{errors.day_to_pay.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/50 p-4 border border-red-800">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 
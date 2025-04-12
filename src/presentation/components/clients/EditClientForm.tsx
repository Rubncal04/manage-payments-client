import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UpdateClientDTO } from '../../../core/domain/Client';
import { clientService } from '../../../core/services/clientService';

interface EditClientFormProps {
  clientId: string;
  initialData?: {
    name: string;
    cell_phone: string;
    day_to_pay: number;
  };
  onSuccess?: () => void;
}

const schema = yup.object({
  name: yup.string().optional(),
  cell_phone: yup.string()
    .matches(/^[0-9]+$/, 'El teléfono solo debe contener números')
    .min(10, 'El teléfono debe tener al menos 10 dígitos')
    .optional(),
  day_to_pay: yup.number()
    .min(1, 'El día debe ser mayor o igual a 1')
    .max(31, 'El día debe ser menor o igual a 31')
    .optional(),
}).required();

export const EditClientForm = ({ clientId, initialData, onSuccess }: EditClientFormProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<UpdateClientDTO>({
    resolver: yupResolver(schema),
    defaultValues: initialData
  });

  const onSubmit = async (data: UpdateClientDTO) => {
    try {
      setLoading(true);
      setError(null);
      await clientService.updateClient(clientId, data);
      onSuccess?.();
      navigate(`/clients/${clientId}`);
    } catch (err) {
      setError('Error al actualizar el cliente. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-200">
          Nombre
        </label>
        <div className="mt-1">
          <input
            {...register('name')}
            type="text"
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="Nombre del cliente"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="cell_phone" className="block text-sm font-medium text-gray-200">
          Teléfono celular
        </label>
        <div className="mt-1">
          <input
            {...register('cell_phone')}
            type="tel"
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="3001234567"
          />
          {errors.cell_phone && (
            <p className="mt-1 text-sm text-red-400">{errors.cell_phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="day_to_pay" className="block text-sm font-medium text-gray-200">
          Día de pago (1-31)
        </label>
        <div className="mt-1">
          <input
            {...register('day_to_pay', { valueAsNumber: true })}
            type="number"
            min="1"
            max="31"
            className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            placeholder="15"
          />
          {errors.day_to_pay && (
            <p className="mt-1 text-sm text-red-400">{errors.day_to_pay.message}</p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate(`/clients/${clientId}`)}
          className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700/50 hover:bg-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Actualizando...' : 'Actualizar Cliente'}
        </button>
      </div>
    </form>
  );
}; 
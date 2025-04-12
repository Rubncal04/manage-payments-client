import { Client } from '../../../core/domain/Client';
import { formatDate } from '../../../core/utils/dateUtils';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export const ClientCard = ({ client, onEdit, onDelete }: ClientCardProps) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold">{getInitials(client.name)}</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
          <p className="text-sm text-gray-500">{client.cell_phone}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Teléfono:</span>
          <span className="text-sm font-medium">{client.cell_phone}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Día de pago:</span>
          <span className="text-sm font-medium">{client.day_to_pay}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Estado:</span>
          <span className={`text-sm font-medium ${
            client.status === 'active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {client.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Último pago:</span>
          <span className="text-sm font-medium">
            {client.last_payment_date ? formatDate(client.last_payment_date) : 'Nunca'}
          </span>
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={() => onEdit(client)}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(client)}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}; 
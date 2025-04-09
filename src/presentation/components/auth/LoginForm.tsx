import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoginDTO } from '../../../core/domain/Auth';
import { authService } from '../../../core/services/authService';

const schema = yup.object({
  email: yup.string().email('Email inválido').required('El email es requerido'),
  password: yup.string().required('La contraseña es requerida'),
}).required();

export const LoginForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginDTO>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginDTO) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Intentando login con:', { email: data.email }); // Debug log
      
      const response = await authService.login(data);
      console.log('Respuesta de login:', response); // Debug log
      
      // Guardar tokens
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Verificar que se guardaron correctamente
      const savedToken = localStorage.getItem('token');
      console.log('Token guardado:', savedToken); // Debug log
      
      if (!savedToken) {
        throw new Error('No se pudo guardar el token');
      }

      // Redirigir al dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error completo:', err); // Debug log
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Inicia sesión
        </h2>
        <p className="mt-2 text-center text-sm text-gray-300">
          ¿No tienes una cuenta?{' '}
          <button
            onClick={() => navigate('/auth/register')}
            className="font-medium text-primary-400 hover:text-primary-300"
          >
            Regístrate
          </button>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/10 backdrop-blur-lg py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <div className="mt-1">
                <input
                  {...register('email')}
                  type="email"
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="tu@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  {...register('password')}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="********"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-500/10 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 
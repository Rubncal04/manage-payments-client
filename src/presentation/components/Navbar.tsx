import { Link, useLocation } from 'react-router-dom';
import { PlusIcon, ClockIcon, ChartBarIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-500">YT Premium</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 inline-block mr-1" />
                Usuarios
              </Link>
              <Link
                to="/history"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/history')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <ClockIcon className="h-5 w-5 inline-block mr-1" />
                Historial
              </Link>
              <Link
                to="/stats"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive('/stats')
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline-block mr-1" />
                Estadísticas
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <Link
              to="/new-user"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Nuevo Usuario
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 
export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
  return new Date(dateString).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  });
}; 
import api from '../services/api';

/**
 * Convierte una URL relativa de imagen a una URL absoluta
 * @param {string} imageUrl - URL relativa o absoluta de la imagen
 * @returns {string} URL absoluta de la imagen
 */
export const getAbsoluteImageUrl = (imageUrl) => {
  // Si no hay URL, retornar avatar por defecto
  if (!imageUrl) {
    return null;
  }

  // Si ya es una URL absoluta, devolverla tal cual
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }

  // Si es una URL relativa, construir la URL absoluta usando el baseURL de api
  const baseUrl = api.defaults.baseURL || 'http://localhost:3000/api';
  // Remover /api del final para obtener la URL base del servidor
  const cleanBaseUrl = baseUrl.replace('/api', '');
  return `${cleanBaseUrl}${imageUrl}`;
};

/**
 * Normaliza el objeto usuario asegurando que todas las URLs sean absolutas
 * @param {object} user - Objeto usuario
 * @returns {object} Usuario con URLs normalizadas
 */
export const normalizeUserUrls = (user) => {
  if (!user) return user;

  return {
    ...user,
    avatar: user.avatar ? getAbsoluteImageUrl(user.avatar) : null,
  };
};

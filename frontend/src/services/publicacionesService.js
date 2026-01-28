import api from './api';

const publicacionesService = {
  getPublicaciones: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.categoria_id) params.append('categoria_id', filters.categoria_id);
      if (filters.precio_min) params.append('precio_min', filters.precio_min);
      if (filters.precio_max) params.append('precio_max', filters.precio_max);

      const response = await api.get(`/publications?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener publicaciones' };
    }
  },

  getPublicacionById: async (id) => {
    try {
      const response = await api.get(`/publications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener publicación' };
    }
  },

  getUserPublicaciones: async () => {
    try {
      const response = await api.get('/publications/user/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener tus publicaciones' };
    }
  },

  createPublicacion: async (publicacionData) => {
    try {
      const response = await api.post('/publications', publicacionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear publicación' };
    }
  },

  updatePublicacion: async (id, publicacionData) => {
    try {
      const response = await api.put(`/publications/${id}`, publicacionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar publicación' };
    }
  },

  deletePublicacion: async (id) => {
    try {
      const response = await api.delete(`/publications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar publicación' };
    }
  },
};

export default publicacionesService;

import api from './api';

const reviewsService = {
  getVendedorReviews: async (vendedorId) => {
    try {
      const response = await api.get(`/reviews/vendedores/${vendedorId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener reseñas' };
    }
  },

  getPublicacionReviews: async (publicacionId) => {
    try {
      const response = await api.get(`/reviews/publicaciones/${publicacionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener reseñas' };
    }
  },

  getVendedorRating: async (vendedorId) => {
    try {
      const response = await api.get(`/reviews/vendedores/${vendedorId}/rating`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener rating' };
    }
  },

  getPublicacionRating: async (publicacionId) => {
    try {
      const response = await api.get(`/reviews/publicaciones/${publicacionId}/rating`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener rating' };
    }
  },

  createPublicacionReview: async (publicacionId, reviewData) => {
    try {
      const response = await api.post(`/reviews/publicaciones/${publicacionId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear reseña' };
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar reseña' };
    }
  }
};

export default reviewsService;

import api from './api';

const reviewsService = {
  getProductReviews: async (productId) => {
    try {
      const response = await api.get(`/reviews/productos/${productId}`);
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

  getProductRating: async (productId) => {
    try {
      const response = await api.get(`/reviews/productos/${productId}/rating`);
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

  createProductReview: async (productId, reviewData) => {
    try {
      const response = await api.post(`/reviews/productos/${productId}`, reviewData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear reseña' };
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

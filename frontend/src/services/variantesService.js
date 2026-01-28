import api from './api';

const variantesService = {
  getVariantesByProduct: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/variantes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener variantes' };
    }
  },

  createVariante: async (productId, varianteData) => {
    try {
      const response = await api.post(`/products/${productId}/variantes`, varianteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear variante' };
    }
  },

  updateVariante: async (productId, varianteId, varianteData) => {
    try {
      const response = await api.put(`/products/${productId}/variantes/${varianteId}`, varianteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar variante' };
    }
  },

  deleteVariante: async (productId, varianteId) => {
    try {
      const response = await api.delete(`/products/${productId}/variantes/${varianteId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar variante' };
    }
  },
};

export default variantesService;

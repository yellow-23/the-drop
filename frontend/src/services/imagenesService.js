import api from './api';

const imagenesService = {
  getImagenesByProduct: async (productId) => {
    try {
      const response = await api.get(`/products/${productId}/imagenes`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener imágenes' };
    }
  },

  uploadImage: async (productId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('imagen', imageFile);

      const response = await api.post(`/products/${productId}/imagenes`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al subir imagen' };
    }
  },

  deleteImage: async (productId, imagenId) => {
    try {
      const response = await api.delete(`/products/${productId}/imagenes/${imagenId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar imagen' };
    }
  },
};

export default imagenesService;

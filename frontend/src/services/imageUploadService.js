import api from './api';
import { getAbsoluteImageUrl } from '../utils/imageUrlHelper';

const imageUploadService = {
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/imagenes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        ...response.data,
        imageUrl: getAbsoluteImageUrl(response.data.imageUrl),
      };
    } catch (error) {
      throw error.response?.data || { message: 'Error al subir imagen' };
    }
  },

  deleteImage: async (filename) => {
    try {
      const response = await api.delete(`/imagenes/upload/${filename}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar imagen' };
    }
  },
};

export default imageUploadService;

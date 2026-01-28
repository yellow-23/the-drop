import api from './api';

const favoritesService = {
  getFavoritos: async () => {
    try {
      const response = await api.get('/favorites');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener favoritos' };
    }
  },

  addFavorito: async (tipoItem, productoId = null, publicacionId = null) => {
    try {
      const payload = {
        tipo_item: tipoItem,
      };
      if (productoId) payload.producto_id = productoId;
      if (publicacionId) payload.publicacion_id = publicacionId;

      const response = await api.post('/favorites', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al agregar a favoritos' };
    }
  },

  removeFavorito: async (favoritoId) => {
    try {
      const response = await api.delete(`/favorites/${favoritoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar de favoritos' };
    }
  },

  isFavorite: async (tipoItem, productoId = null, publicacionId = null) => {
    try {
      const response = await api.get('/favorites');
      return response.data.favoritos.some(fav => {
        if (fav.tipo_item !== tipoItem) return false;
        if (tipoItem === 'producto') return fav.item_id === productoId;
        if (tipoItem === 'publicacion') return fav.item_id === publicacionId;
        return false;
      });
    } catch (error) {
      return false;
    }
  },
};

export default favoritesService;

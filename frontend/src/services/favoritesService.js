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

  addFavorito: async (tipoItem, itemId) => {
    try {
      const payload = {
        tipo_item: tipoItem,
      };
      if (tipoItem === 'producto') {
        payload.producto_id = itemId;
      } else if (tipoItem === 'publicacion') {
        payload.publicacion_id = itemId;
      }

      console.log('🔵 Enviando favorito:', payload);
      const response = await api.post('/favorites', payload);
      console.log('✅ Favorito agregado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al agregar favorito:', error.response?.data || error.message);
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

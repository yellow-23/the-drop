import api from './api';

const cartService = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener carrito' };
    }
  },

  addToCart: async (tipoItem, varianteProductoId = null, publicacionId = null, cantidad = 1) => {
    try {
      const payload = {
        tipo_item: tipoItem,
        cantidad,
      };
      if (varianteProductoId) payload.variante_producto_id = varianteProductoId;
      if (publicacionId) payload.publicacion_id = publicacionId;

      const response = await api.post('/cart/add', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al agregar al carrito' };
    }
  },

  updateCartItem: async (itemId, cantidad) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { cantidad });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar carrito' };
    }
  },

  removeFromCart: async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar del carrito' };
    }
  },

  clearCart: async () => {
    try {
      const response = await api.delete('/cart');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al limpiar carrito' };
    }
  },
};

export default cartService;

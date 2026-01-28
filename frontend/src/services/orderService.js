import api from './api';

const orderService = {
  getOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener órdenes' };
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener orden' };
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear orden' };
    }
  },

  updateOrderStatus: async (orderId, estado) => {
    try {
      const response = await api.put(`/orders/${orderId}`, { estado });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar orden' };
    }
  },
};

export default orderService;

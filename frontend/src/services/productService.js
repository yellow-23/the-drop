import api from './api';

const productService = {
  getAllProducts: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.marca_id) params.append('marca_id', filters.marca_id);
      if (filters.talla_id) params.append('talla_id', filters.talla_id);
      if (filters.precio_min) params.append('precio_min', filters.precio_min);
      if (filters.precio_max) params.append('precio_max', filters.precio_max);

      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener productos' };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al obtener producto' };
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await api.post('/products', productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al crear producto' };
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al actualizar producto' };
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error al eliminar producto' };
    }
  },
};

export default productService;

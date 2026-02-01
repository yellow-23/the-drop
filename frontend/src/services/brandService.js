import api from "./api";

const brandService = {
  getBrands: async () => {
    try {
      const response = await api.get("/brands");
      return response.data.marcas;
    } catch (error) {
      throw error.response?.data || {
        message: "Error al obtener marcas",
      };
    }
  },
};

export default brandService;

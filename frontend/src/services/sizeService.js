import api from "./api";

const sizeService = {
  getSizes: async () => {
    try {
      const response = await api.get("/sizes");
      return response.data.tallas;
    } catch (error) {
      throw error.response?.data || {
        message: "Error al obtener tallas",
      };
    }
  },
};

export default sizeService;

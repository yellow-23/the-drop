import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import favoritesService from "../services/favoritesService";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  // Cargar favoritos desde el backend cuando el usuario inicia sesión
  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    try {
      const data = await favoritesService.getFavoritos();
      setFavorites(data.favoritos || []);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
    }
  };

  const toggleFavorite = async (product) => {
    try {
      const isFav = favorites.find((p) => p.id === product.id);
      
      if (isFav) {
        // Eliminar
        await favoritesService.removeFavorito(isFav.favorito_id);
        setFavorites((prev) => prev.filter((p) => p.id !== product.id));
      } else {
        // Agregar
        await favoritesService.addFavorito("publicacion", null, product.id);
        setFavorites((prev) => [...prev, product]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((p) => p.id === id);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);


import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import favoritesService from "../services/favoritesService";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Cargar favoritos desde el backend cuando el usuario inicia sesión
  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoritesService.getFavoritos();
      setFavorites(data.favoritos || []);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (product) => {
    if (!user?.id) {
      console.error("Usuario no autenticado");
      return;
    }

    if (loading) return; 

    try {
      setLoading(true);
      console.log('Toggle favorito para producto:', product);
    
      const existingFav = favorites.find(
        (fav) => String(fav.id) === String(product.id)
      );
      
      if (existingFav && existingFav.favorito_id) {
        console.log('Removiendo favorito:', existingFav.favorito_id);
        await favoritesService.removeFavorito(existingFav.favorito_id);
        setFavorites((prev) => 
          prev.filter((fav) => String(fav.id) !== String(product.id))
        );
      } else {
        console.log('Agregando favorito:', product.id);
        await favoritesService.addFavorito("publicacion", product.id);
        await loadFavorites();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      await loadFavorites();
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => String(fav.id) === String(id));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading, loadFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);


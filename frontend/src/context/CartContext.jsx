import { createContext, useEffect, useState } from "react";
import cartService from "../services/cartService";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart({
        items: data.items,
        total: data.total,
        itemCount: data.itemCount,
      });
    } catch (error) {
      console.warn("Carrito no disponible, debes logearte");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (tipoItem, varianteProductoId, publicacionId, cantidad = 1) => {
    await cartService.addToCart(
      tipoItem,
      varianteProductoId,
      publicacionId,
      cantidad
    );
    await fetchCart();
  };

  const updateCartItem = async (itemId, cantidad) => {
    await cartService.updateCartItem(itemId, cantidad);
    await fetchCart();
  };

  const removeFromCart = async (itemId) => {
    await cartService.removeFromCart(itemId);
    await fetchCart();
  };

  const clearCart = async () => {
    await cartService.clearCart();
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...cart,
        loading,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

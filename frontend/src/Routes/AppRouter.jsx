import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Home from "../Pages/home/Home";
import Catalog from "../Pages/products/Catalog";
import ProductDetail from "../Pages/products/ProductDetail";
import CreateProduct from "../Pages/products/CreateProduct";
import Profile from "../Pages/profile/Profile";
import Cart from "../Pages/cart/Cart";
import Checkout from "../Pages/cart/Checkout";
import Login from "../Pages/auth/Login";
import Register from "../Pages/auth/Register";

function AppRouter() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* Públicas bloqueadas si hay sesión */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Privadas */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-product"
        element={
          <ProtectedRoute>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;

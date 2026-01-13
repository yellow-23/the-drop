import { Routes, Route } from "react-router-dom";

import Home from "../Pages/Home";
import Catalog from "../Pages/Catalog";
import ProductDetail from "../Pages/ProductDetail";
import CreateProduct from "../Pages/CreateProduct";
import Profile from "../Pages/Profile";
import Cart from "../Pages/Cart";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/create-product" element={<CreateProduct />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default AppRouter;

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { CartProvider } from "./Context/CartContext.jsx";
import { AuthProvider } from './Context/AuthContext.jsx'
import { FavoritesProvider } from './Context/FavoritesContext.jsx'
import { NotificationProvider } from './Context/NotificationContext.jsx'
import { LoginModalProvider } from './Context/LoginModalContext.jsx'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <AuthProvider>
        <LoginModalProvider>
          <CartProvider>
            <FavoritesProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </FavoritesProvider>
          </CartProvider>
        </LoginModalProvider>
      </AuthProvider>
    </NotificationProvider>
  </React.StrictMode>
)

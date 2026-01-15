import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import { AuthProvider } from './Context/AuthContext.jsx'
import { FavoritesProvider } from './Context/FavoritesContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <FavoritesProvider>
      <App />
      </FavoritesProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

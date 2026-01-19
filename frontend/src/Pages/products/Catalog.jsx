import { useState, useMemo, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import { getProducts } from '../../mock/Products';
import ProductCard from '../../Components/product/ProductCard';
import './Catalog.css';
import logo from '../../assets/img/the-drop-logo-horizontal.png';
import { BsCart3 } from 'react-icons/bs';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [filtros, setFiltros] = useState({
    marca: '',
    precioMin: '',
    precioMax: '',
    talla: '',
  });
  
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    setProducts(getProducts());
  }, []);

  const productosFiltrarados = useMemo(() => {
    let resultado = [...products];

    if (filtros.marca) {
      resultado = resultado.filter(p =>
        p.brand.toLowerCase().includes(filtros.marca.toLowerCase())
      );
    }

    if (filtros.precioMin) {
      resultado = resultado.filter(p => p.price >= Number(filtros.precioMin));
    }

    if (filtros.precioMax) {
      resultado = resultado.filter(p => p.price <= Number(filtros.precioMax));
    }

    if (filtros.talla) {
      resultado = resultado.filter(p => p.size === filtros.talla);
    }

    return resultado;
  }, [products, filtros]);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      marca: '',
      precioMin: '',
      precioMax: '',
      talla: '',
    });
  };

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <img src={logo} alt="The Drop" className="catalog-logo" />
        <h1>Catálogo de Zapatillas</h1>
        <p className="catalog-subtitle">Encuentra tus zapatillas sostenibles favoritas</p>
      </div>

      {/* Filtros */}
      <div className="filtros-section">
        <h3>Filtrar por:</h3>
        <div className="filtros-grid">
          <div className="filtro-grupo">
            <label htmlFor="marca">Marca</label>
            <input
              type="text"
              id="marca"
              name="marca"
              placeholder="Ej: Nike, Adidas..."
              value={filtros.marca}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="filtro-grupo">
            <label htmlFor="precioMin">Precio mínimo</label>
            <input
              type="number"
              id="precioMin"
              name="precioMin"
              placeholder="0"
              value={filtros.precioMin}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="filtro-grupo">
            <label htmlFor="precioMax">Precio máximo</label>
            <input
              type="number"
              id="precioMax"
              name="precioMax"
              placeholder="100000"
              value={filtros.precioMax}
              onChange={handleFiltroChange}
            />
          </div>

          <div className="filtro-grupo">
            <label htmlFor="talla">Talla</label>
            <select
              id="talla"
              name="talla"
              value={filtros.talla}
              onChange={handleFiltroChange}
            >
              <option value="">Todas</option>
              <option value="35">35</option>
              <option value="36">36</option>
              <option value="37">37</option>
              <option value="38">38</option>
              <option value="39">39</option>
              <option value="40">40</option>
              <option value="41">41</option>
              <option value="42">42</option>
              <option value="43">43</option>
              <option value="44">44</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>

        <div className="filtros-acciones">
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Grid de Productos */}
      <div className="productos-section">
        <p className="resultado-count">
          {productosFiltrarados.length} zapatillas encontradas
        </p>
        
        <div className="productos-grid">
          {productosFiltrarados.length > 0 ? (
            productosFiltrarados.map(producto => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                image={producto.image}
                name={producto.name}
                size={producto.size}
                gender={producto.gender}
                brand={producto.brand}
                price={producto.price}
              />
            ))
          ) : (
            <p className="no-results">No se encontraron zapatillas con esos filtros</p>
          )}
        </div>
      </div>

      {/* BOTÓN FLOTANTE DEL CARRITO */}
      <button 
        className="floating-cart-btn"
        onClick={() => navigate('/cart')}
        title="Ver carrito"
      >
        <BsCart3 size={26} color="#ffffff" />
        {cartItems?.length > 0 && (
          <span className="cart-count">{cartItems.length}</span>
        )}
      </button>
    </div>
  );
}

export default Catalog;

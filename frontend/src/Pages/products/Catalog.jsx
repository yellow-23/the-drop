import { useState, useMemo, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import publicacionesService from '../../services/publicacionesService';
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
    const fetchProducts = async () => {
    try {
      const data = await publicacionesService.getPublicaciones();
      setProducts(data.publicaciones);
    } catch (error) {
      console.error('Error cargando productos', error);
    }
  };

  fetchProducts();
  }, []);

  const productosFiltrados = products;

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

  console.log(products);


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
          {productosFiltrados.length} zapatillas encontradas
        </p>
        
        <div className="productos-grid">
          {productosFiltrados.length > 0 ? (
            productosFiltrados.map(producto => (
              <ProductCard
                key={producto.id}
                id={producto.id}
                imagen={producto.imagenes?.[0]}
                titulo={producto.titulo}
                talla={producto.talla || "—"}
                genero={producto.genero || "—"}
                marca={producto.marca || "—"}
                precio_clp={producto.precio_clp}
                condicion={producto.condicion}
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

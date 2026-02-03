import { useState, useMemo, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../Context/CartContext';
import publicacionesService from '../../services/publicacionesService';
import ProductCard from '../../Components/product/ProductCard';
import Footer from '../../Components/layout/Footer';
import './Catalog.css';
import logo from '../../assets/img/the-drop-logo-horizontal.png';
import { BsCart3 } from 'react-icons/bs';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina = 12;
  const [filtros, setFiltros] = useState({
    busqueda: '',
    marca: '',
    precioMin: '',
    precioMax: '',
    talla: '',
  });
  
  const { itemCount } = useContext(CartContext);
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

  const productosFiltrados = products.filter(product => {
    if (filtros.busqueda && !product.titulo.toLowerCase().includes(filtros.busqueda.toLowerCase())) {
      return false;
    }

    if (filtros.marca && !product.marca?.nombre.toLowerCase().includes(filtros.marca.toLowerCase())) {
      return false;
    }

    if (filtros.precioMin && product.precio < parseFloat(filtros.precioMin)) {
      return false;
    }

    if (filtros.precioMax && product.precio > parseFloat(filtros.precioMax)) {
      return false;
    }

    if (filtros.talla && !product.talla?.nombre.toLowerCase().includes(filtros.talla.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value,
    }));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      marca: '',
      precioMin: '',
      precioMax: '',
      talla: '',
    });
    setPaginaActual(1);
  };

  return (
    <main>
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
            <label htmlFor="busqueda">Buscar</label>
            <input
              type="text"
              id="busqueda"
              name="busqueda"
              placeholder="Buscar por nombre..."
              value={filtros.busqueda}
              onChange={handleFiltroChange}
            />
          </div>

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

      <div className="productos-section">
        <p className="resultado-count">
          {productosFiltrados.length} zapatillas encontradas
        </p>
        
        <div className="productos-grid">
          {productosFiltrados.length > 0 ? (
            (() => {
              const indiceInicial = (paginaActual - 1) * productosPorPagina;
              const indiceFinal = indiceInicial + productosPorPagina;
              const productosEnPagina = productosFiltrados.slice(indiceInicial, indiceFinal);
              const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
              
              return (
                <>
                  {productosEnPagina.map(producto => (
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
                  ))}
                  {totalPaginas > 1 && (
                    <div className="pagination" style={{ gridColumn: '1 / -1', marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                        disabled={paginaActual === 1}
                        style={{ padding: '0.5rem 1rem', cursor: paginaActual === 1 ? 'not-allowed' : 'pointer', opacity: paginaActual === 1 ? 0.5 : 1 }}
                      >
                        ← Anterior
                      </button>
                      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                        <button
                          key={num}
                          onClick={() => setPaginaActual(num)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: paginaActual === num ? '#810fce' : '#f0f0f0',
                            color: paginaActual === num ? '#fff' : '#000',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: paginaActual === num ? 'bold' : 'normal'
                          }}
                        >
                          {num}
                        </button>
                      ))}
                      <button
                        onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                        disabled={paginaActual === totalPaginas}
                        style={{ padding: '0.5rem 1rem', cursor: paginaActual === totalPaginas ? 'not-allowed' : 'pointer', opacity: paginaActual === totalPaginas ? 0.5 : 1 }}
                      >
                        Siguiente →
                      </button>
                    </div>
                  )}
                </>
              );
            })()
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
        {itemCount > 0 && (
          <span className="cart-count">{itemCount}</span>
        )}
      </button>
    </div>
    <Footer />
    </main>
  );
}

export default Catalog;

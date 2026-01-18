import './CartSummary.css';

function CartSummary({ total, itemCount, onClear }) {
  const subtotal = total;
  const envio = total > 50000 ? 0 : 5000;
  const totalFinal = subtotal + envio;

  return (
    <div className="cart-summary">
      <h3>Resumen</h3>

      <div className="summary-item">
        <span>Subtotal</span>
        <span className="amount">${subtotal.toLocaleString('es-CL')}</span>
      </div>

      <div className="summary-item">
        <span>Envío</span>
        <span className={`amount ${envio === 0 ? 'free' : ''}`}>
          {envio === 0 ? 'GRATIS' : `$${envio.toLocaleString('es-CL')}`}
        </span>
      </div>

      {envio > 0 && (
        <p className="free-shipping-msg">
          Compra por ${(50000 - subtotal).toLocaleString('es-CL')} más para envío gratis
        </p>
      )}

      <div className="summary-divider"></div>

      <div className="summary-total">
        <span>Total</span>
        <span className="amount">${totalFinal.toLocaleString('es-CL')}</span>
      </div>

      <button className="btn-checkout">
        Ir al Checkout
      </button>

      <button onClick={onClear} className="btn-clear-summary">
        Vaciar Carrito
      </button>

      <div className="summary-info">
        <p>✓ Envío a todo Chile</p>
        <p>✓ Compra segura</p>
        <p>✓ Retorno en 14 días</p>
      </div>
    </div>
  );
}

export default CartSummary;

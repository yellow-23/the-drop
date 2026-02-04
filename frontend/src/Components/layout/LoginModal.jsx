import { useAuth } from "../../Context/AuthContext";
import { useLoginModal } from "../../Context/LoginModalContext";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css";

function LoginModal() {
  const { isOpen, closeLoginModal, message } = useLoginModal();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    try {
      await login(form.email.value, form.password.value);
      closeLoginModal();
      navigate("/home");
    } catch (error) {
      alert(error.message || "Error al iniciar sesión");
    }
  };

  const handleGoToRegister = () => {
    closeLoginModal();
    navigate("/register");
  };

  if (!isOpen) return null;

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <button
          className="login-modal-close"
          onClick={closeLoginModal}
          aria-label="Cerrar"
        >
          ✕
        </button>

        <div className="login-modal-header">
          <h2>Inicia Sesión</h2>
          {message && <p className="login-modal-message">{message}</p>}
        </div>

        <form className="login-modal-form" onSubmit={handleSubmit}>
          <div className="login-modal-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="login-modal-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="login-modal-button">
            Ingresar
          </button>
        </form>

        <div className="login-modal-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <button
              type="button"
              className="link-button"
              onClick={handleGoToRegister}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;

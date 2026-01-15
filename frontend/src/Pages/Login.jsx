import "../Styles/Auth.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const res = login(form.email.value, form.password.value);

    if (!res.success) {
      alert(res.message);
      return;
    }

    navigate("/profile");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <div className="auth-field">
          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            required
          />
        </div>

        <div className="auth-field">
          <label>Contraseña</label>
          <input
            name="password"
            type="password"
            placeholder="********"
            required
          />
        </div>

        <button className="auth-button">Ingresar</button>

        <p className="auth-footer">
          ¿No tienes cuenta? <a href="/register">Regístrate</a>
        </p>
      </form>
    </div>
  );
}

export default Login;

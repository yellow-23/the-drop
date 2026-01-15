import "../Styles/Auth.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    const userData = {
      name: form.name.value,
      lastName: form.lastName.value,
      email: form.email.value,
      password: form.password.value,
    };

    const res = register(userData.email, userData.password);

    if (!res.success) {
      alert(res.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Crear cuenta</h2>

        <div className="auth-field">
          <label>Nombre</label>
          <input name="name" type="text" placeholder="Nombre" required />
        </div>

        <div className="auth-field">
          <label>Apellido</label>
          <input name="lastName" type="text" placeholder="Apellido" required />
        </div>

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

        <button className="auth-button">Registrarse</button>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
        </p>
      </form>
    </div>
  );
}

export default Register;

import "../Styles/Auth.css";

function Register() {
  return (
    <div className="auth-page">
      <form className="auth-card">
        <h2>Crear cuenta</h2>

        <div className="auth-field">
          <label>Nombre</label>
          <input type="text" placeholder="Nombre" />
        </div>

        <div className="auth-field">
          <label>Apellido</label>
          <input type="text" placeholder="Apellido" />
        </div>

        <div className="auth-field">
          <label>Email</label>
          <input type="email" placeholder="correo@ejemplo.com" />
        </div>

        <div className="auth-field">
          <label>Contraseña</label>
          <input type="password" placeholder="********" />
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
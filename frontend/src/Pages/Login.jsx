import "../Styles/Auth.css";

function Login() {
  return (
    <div className="auth-page">
      <form className="auth-card">
        <h2>Iniciar sesión</h2>

        <div className="auth-field">
          <label>Email</label>
          <input type="email" placeholder="correo@ejemplo.com" />
        </div>

        <div className="auth-field">
          <label>Contraseña</label>
          <input type="password" placeholder="********" />
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
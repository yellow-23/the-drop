const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "tu_secret_key", {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, nombre, region, comuna } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email y contraseña requeridos",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        ok: false,
        message: "Email ya registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = Date.now();

    const newUser = await pool.query(
      "INSERT INTO usuarios (id, email, password_hash, nombre, region, comuna, reputacion, creado_en) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, email, nombre",
      [userId, email, hashedPassword, nombre || null, region || null, comuna || null, 5.0, new Date()]
    );

    const token = generateToken(newUser.rows[0].id);

    res.status(201).json({
      ok: true,
      message: "Usuario registrado exitosamente",
      user: newUser.rows[0],
      token,
    });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({
      ok: false,
      message: "Error al registrar usuario",
      error: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "Email y contraseña requeridos",
      });
    }

    const userResult = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas",
      });
    }

    const user = userResult.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales incorrectas",
      });
    }

    const token = generateToken(user.id);

    res.json({
      ok: true,
      message: "Login exitoso",
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        region: user.region,
        comuna: user.comuna,
        avatar: user.avatar,
      },
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      ok: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const userResult = await pool.query(
      "SELECT id, email, nombre, region, comuna, reputacion, avatar, creado_en FROM usuarios WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      user: userResult.rows[0],
    });
  } catch (error) {
    console.error("Error en getProfile:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener perfil",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { nombre, region, comuna, avatar } = req.body;

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = COALESCE($2, nombre),
           region = COALESCE($3, region),
           comuna = COALESCE($4, comuna),
           avatar = COALESCE($5, avatar)
       WHERE id = $1
       RETURNING id, email, nombre, region, comuna, reputacion, avatar`,
      [userId, nombre, region, comuna, avatar]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      message: "Perfil actualizado",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateProfile:", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar perfil",
      error: error.message,
    });
  }
};

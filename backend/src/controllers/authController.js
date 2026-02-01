const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret_key_super_segura_2026", {
    expiresIn: "7d",
  });
};

exports.register = async (req, res) => {
  try {
    const { email, password, nombre, apellido } = req.body;

    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({
        ok: false,
        message: "Datos incompletos",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        ok: false,
        message: "Email ya registrado",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (email, password_hash, nombre, apellido, reputacion)
       VALUES ($1, $2, $3, $4, 5.0)
       RETURNING id, email, nombre, apellido, nickname, region, comuna, avatar`,
      [email, hashedPassword, nombre, apellido]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    res.status(201).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al registrar usuario",
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
        apellido: user.apellido,
        nickname: user.nickname,
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
      "SELECT id, email, nombre, apellido, nickname, region, comuna, reputacion, avatar, creado_en FROM usuarios WHERE id = $1",
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
    const { nombre, apellido, nickname, region, comuna, avatar } = req.body;

    const result = await pool.query(
      `UPDATE usuarios
       SET nombre   = COALESCE($2, nombre),
           apellido = COALESCE($3, apellido),
           nickname = COALESCE($4, nickname),
           region   = COALESCE($5, region),
           comuna   = COALESCE($6, comuna),
           avatar   = COALESCE($7, avatar)
       WHERE id = $1
       RETURNING id, email, nombre, apellido, nickname, region, comuna, avatar`,
      [userId, nombre, apellido, nickname, region, comuna, avatar]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    res.json({
      ok: true,
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al actualizar perfil",
    });
  }
};

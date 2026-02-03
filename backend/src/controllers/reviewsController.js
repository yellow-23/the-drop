const pool = require("../db");

exports.getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.creado_en as fecha,
        r.usuario_id,
        u.nombre as usuario,
        u.avatar
      FROM resenas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.producto_id = $1
      ORDER BY r.creado_en DESC`,
      [productId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

exports.getPublicacionReviews = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const result = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.creado_en as fecha,
        r.usuario_id,
        u.nombre as usuario,
        u.avatar
      FROM resenas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.publicacion_id = $1
      ORDER BY r.creado_en DESC`,
      [publicacionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
  }
};

exports.createProductReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    const usuarioId = req.user.id;

    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const existing = await pool.query(
      `SELECT id FROM resenas 
       WHERE usuario_id = $1 AND producto_id = $2`,
      [usuarioId, productId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Ya dejaste una reseña para este producto" });
    }

    const result = await pool.query(
      `INSERT INTO resenas (usuario_id, producto_id, rating, comment, creado_en)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, rating, comment, creado_en as fecha`,
      [usuarioId, productId, rating, comment]
    );

    const userResult = await pool.query(
      `SELECT nombre, avatar FROM usuarios WHERE id = $1`,
      [usuarioId]
    );

    const review = {
      ...result.rows[0],
      usuario_id: usuarioId,
      usuario: userResult.rows[0].nombre,
      avatar: userResult.rows[0].avatar
    };

    res.status(201).json(review);
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

exports.createPublicacionReview = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const { rating, comment } = req.body;
    const usuarioId = req.user.id;

    if (!rating || !comment || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const existing = await pool.query(
      `SELECT id FROM resenas 
       WHERE usuario_id = $1 AND publicacion_id = $2`,
      [usuarioId, publicacionId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Ya dejaste una reseña para esta publicación" });
    }

    const result = await pool.query(
      `INSERT INTO resenas (usuario_id, publicacion_id, rating, comment, creado_en)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, rating, comment, creado_en as fecha`,
      [usuarioId, publicacionId, rating, comment]
    );

    const userResult = await pool.query(
      `SELECT nombre, avatar FROM usuarios WHERE id = $1`,
      [usuarioId]
    );

    const review = {
      ...result.rows[0],
      usuario_id: usuarioId,
      usuario: userResult.rows[0].nombre,
      avatar: userResult.rows[0].avatar
    };

    res.status(201).json(review);
  } catch (error) {
    console.error("Error al crear reseña:", error);
    res.status(500).json({ message: "Error al crear reseña" });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const usuarioId = req.user.id;

    const result = await pool.query(
      `DELETE FROM resenas 
       WHERE id = $1 AND usuario_id = $2
       RETURNING id`,
      [reviewId, usuarioId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Reseña no encontrada o no autorizado" });
    }

    res.json({ message: "Reseña eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({ message: "Error al eliminar reseña" });
  }
};

exports.getProductRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await pool.query(
      `SELECT 
        COALESCE(AVG(rating), 0) as promedio,
        COUNT(*) as total_resenas
      FROM resenas
      WHERE producto_id = $1`,
      [productId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener rating:", error);
    res.status(500).json({ message: "Error al obtener rating" });
  }
};

exports.getPublicacionRating = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    const result = await pool.query(
      `SELECT 
        COALESCE(AVG(rating), 0) as promedio,
        COUNT(*) as total_resenas
      FROM resenas
      WHERE publicacion_id = $1`,
      [publicacionId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener rating:", error);
    res.status(500).json({ message: "Error al obtener rating" });
  }
};

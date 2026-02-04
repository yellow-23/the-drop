const pool = require("../db");

exports.getVendedorReviews = async (req, res) => {
  try {
    const { vendedorId } = req.params;
    const result = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.creado_en as fecha,
        r.usuario_id,
        u.nombre as usuario,
        u.avatar,
        p.titulo as publicacion_titulo
      FROM resenas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      LEFT JOIN publicaciones_usuario p ON r.publicacion_id = p.id
      WHERE r.vendedor_id = $1
      ORDER BY r.creado_en DESC`,
      [vendedorId]
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
    
    const pubResult = await pool.query(
      `SELECT usuario_id FROM publicaciones_usuario WHERE id = $1`,
      [publicacionId]
    );
    
    if (pubResult.rows.length === 0) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }
    
    const vendedorId = pubResult.rows[0].usuario_id;
    
    const result = await pool.query(
      `SELECT 
        r.id,
        r.rating,
        r.comment,
        r.creado_en as fecha,
        r.usuario_id,
        u.nombre as usuario,
        u.avatar,
        p.titulo as publicacion_titulo
      FROM resenas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      LEFT JOIN publicaciones_usuario p ON r.publicacion_id = p.id
      WHERE r.vendedor_id = $1
      ORDER BY r.creado_en DESC`,
      [vendedorId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener reseñas" });
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

    const pubResult = await pool.query(
      `SELECT usuario_id FROM publicaciones_usuario WHERE id = $1`,
      [publicacionId]
    );

    if (pubResult.rows.length === 0) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const vendedorId = pubResult.rows[0].usuario_id;

    if (vendedorId === usuarioId) {
      return res.status(400).json({ message: "No puedes reseñar tu propia publicación" });
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
      `INSERT INTO resenas (usuario_id, vendedor_id, publicacion_id, rating, comment, creado_en)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, rating, comment, creado_en as fecha`,
      [usuarioId, vendedorId, publicacionId, rating, comment]
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

exports.getPublicacionRating = async (req, res) => {
  try {
    const { publicacionId } = req.params;
    
    const pubResult = await pool.query(
      `SELECT usuario_id FROM publicaciones_usuario WHERE id = $1`,
      [publicacionId]
    );
    
    if (pubResult.rows.length === 0) {
      return res.json({ promedio: 0, total_resenas: 0 });
    }
    
    const vendedorId = pubResult.rows[0].usuario_id;
    
    const result = await pool.query(
      `SELECT 
        COALESCE(AVG(rating), 0) as promedio,
        COUNT(*) as total_resenas
      FROM resenas
      WHERE vendedor_id = $1`,
      [vendedorId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener rating:", error);
    res.status(500).json({ message: "Error al obtener rating" });
  }
};

exports.getVendedorRating = async (req, res) => {
  try {
    const { vendedorId } = req.params;
    const result = await pool.query(
      `SELECT 
        COALESCE(AVG(rating), 0) as promedio,
        COUNT(*) as total_resenas
      FROM resenas
      WHERE vendedor_id = $1`,
      [vendedorId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener rating:", error);
    res.status(500).json({ message: "Error al obtener rating" });
  }
};

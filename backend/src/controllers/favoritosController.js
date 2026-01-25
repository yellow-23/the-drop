const pool = require("../db");

exports.getFavoritos = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        f.id,
        f.tipo_item,
        f.creado_en,
        CASE 
          WHEN f.tipo_item = 'producto' THEN p.titulo
          WHEN f.tipo_item = 'publicacion' THEN pu.titulo
        END as titulo,
        CASE 
          WHEN f.tipo_item = 'producto' THEN p.id
          WHEN f.tipo_item = 'publicacion' THEN pu.id
        END as item_id
       FROM favoritos f
       LEFT JOIN productos p ON f.producto_id = p.id
       LEFT JOIN publicaciones_usuario pu ON f.publicacion_id = pu.id
       WHERE f.usuario_id = $1
       ORDER BY f.creado_en DESC`,
      [userId]
    );

    res.json({
      ok: true,
      favoritos: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error en getFavoritos:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener favoritos",
      error: error.message,
    });
  }
};

exports.addFavorito = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo_item, producto_id, publicacion_id } = req.body;

    if (!tipo_item) {
      return res.status(400).json({
        ok: false,
        message: "tipo_item es requerido (producto o publicacion)",
      });
    }

    if (tipo_item === "producto" && !producto_id) {
      return res.status(400).json({
        ok: false,
        message: "producto_id es requerido para tipo producto",
      });
    }

    if (tipo_item === "publicacion" && !publicacion_id) {
      return res.status(400).json({
        ok: false,
        message: "publicacion_id es requerido para tipo publicacion",
      });
    }

    // Verificar que el producto/publicación existe
    if (tipo_item === "producto") {
      const productResult = await pool.query(
        "SELECT id FROM productos WHERE id = $1",
        [producto_id]
      );
      if (productResult.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "Producto no encontrado",
        });
      }
    } else if (tipo_item === "publicacion") {
      const pubResult = await pool.query(
        "SELECT id FROM publicaciones_usuario WHERE id = $1",
        [publicacion_id]
      );
      if (pubResult.rows.length === 0) {
        return res.status(404).json({
          ok: false,
          message: "Publicación no encontrada",
        });
      }
    }

    // Verificar que no está ya en favoritos
    const existingResult = await pool.query(
      `SELECT id FROM favoritos 
       WHERE usuario_id = $1 AND tipo_item = $2 
       AND (producto_id = $3 OR publicacion_id = $4)`,
      [userId, tipo_item, producto_id || null, publicacion_id || null]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Este item ya está en favoritos",
      });
    }

    const favoritoId = Date.now();

    const result = await pool.query(
      `INSERT INTO favoritos (id, usuario_id, tipo_item, producto_id, publicacion_id, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [favoritoId, userId, tipo_item, producto_id || null, publicacion_id || null, new Date()]
    );

    res.status(201).json({
      ok: true,
      message: "Agregado a favoritos",
      favorito: result.rows[0],
    });
  } catch (error) {
    console.error("Error en addFavorito:", error);
    res.status(500).json({
      ok: false,
      message: "Error al agregar a favoritos",
      error: error.message,
    });
  }
};

exports.removeFavorito = async (req, res) => {
  try {
    const userId = req.userId;
    const { favoritoId } = req.params;

    const favoritoResult = await pool.query(
      "SELECT usuario_id FROM favoritos WHERE id = $1",
      [favoritoId]
    );

    if (favoritoResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Favorito no encontrado",
      });
    }

    if (favoritoResult.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No autorizado",
      });
    }

    await pool.query(
      "DELETE FROM favoritos WHERE id = $1",
      [favoritoId]
    );

    res.json({
      ok: true,
      message: "Removido de favoritos",
    });
  } catch (error) {
    console.error("Error en removeFavorito:", error);
    res.status(500).json({
      ok: false,
      message: "Error al remover de favoritos",
      error: error.message,
    });
  }
};

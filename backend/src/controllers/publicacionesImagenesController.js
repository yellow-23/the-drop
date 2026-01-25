const pool = require("../db");

exports.getImagenesPublicacion = async (req, res) => {
  try {
    const { publicacionId } = req.params;

    const result = await pool.query(
      `SELECT id, publicacion_id, url_imagen
       FROM imagenes_publicacion_usuario
       WHERE publicacion_id = $1
       ORDER BY id ASC`,
      [publicacionId]
    );

    res.json({
      ok: true,
      imagenes: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error en getImagenesPublicacion:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener imágenes",
      error: error.message,
    });
  }
};

exports.createImagenPublicacion = async (req, res) => {
  try {
    const userId = req.userId;
    const { publicacionId } = req.params;
    const { url_imagen } = req.body;

    if (!url_imagen) {
      return res.status(400).json({
        ok: false,
        message: "url_imagen es requerida",
      });
    }

    const publicacionResult = await pool.query(
      "SELECT usuario_id FROM publicaciones_usuario WHERE id = $1",
      [publicacionId]
    );

    if (publicacionResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Publicación no encontrada",
      });
    }

    if (publicacionResult.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No autorizado para agregar imágenes a esta publicación",
      });
    }

    const imagenId = Date.now();

    const result = await pool.query(
      `INSERT INTO imagenes_publicacion_usuario (id, publicacion_id, url_imagen)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [imagenId, publicacionId, url_imagen]
    );

    res.status(201).json({
      ok: true,
      message: "Imagen agregada",
      imagen: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createImagenPublicacion:", error);
    res.status(500).json({
      ok: false,
      message: "Error al agregar imagen",
      error: error.message,
    });
  }
};

exports.deleteImagenPublicacion = async (req, res) => {
  try {
    const userId = req.userId;
    const { imagenId } = req.params;

    const imagenResult = await pool.query(
      "SELECT ipu.id, ipu.publicacion_id, pu.usuario_id FROM imagenes_publicacion_usuario ipu JOIN publicaciones_usuario pu ON ipu.publicacion_id = pu.id WHERE ipu.id = $1",
      [imagenId]
    );

    if (imagenResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Imagen no encontrada",
      });
    }

    if (imagenResult.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No autorizado para eliminar esta imagen",
      });
    }

    await pool.query(
      "DELETE FROM imagenes_publicacion_usuario WHERE id = $1",
      [imagenId]
    );

    res.json({
      ok: true,
      message: "Imagen eliminada",
    });
  } catch (error) {
    console.error("Error en deleteImagenPublicacion:", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar imagen",
      error: error.message,
    });
  }
};

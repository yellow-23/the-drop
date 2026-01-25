const pool = require("../db");

exports.getImagenes = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    const result = await pool.query(
      `SELECT id, producto_id, url_imagen
       FROM imagenes_producto
       WHERE producto_id = $1
       ORDER BY id ASC`,
      [productId]
    );

    res.json({
      ok: true,
      imagenes: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error en getImagenes:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener imágenes",
      error: error.message,
    });
  }
};

exports.createImagen = async (req, res) => {
  try {
    const userId = req.userId;
    const productId = parseInt(req.params.productId);
    const { url_imagen } = req.body;

    if (!url_imagen) {
      return res.status(400).json({
        ok: false,
        message: "url_imagen es requerida",
      });
    }

    const productResult = await pool.query(
      "SELECT usuario_id FROM productos WHERE id = $1",
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    if (productResult.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No autorizado para agregar imágenes a este producto",
      });
    }

    const imagenId = Date.now();

    const result = await pool.query(
      `INSERT INTO imagenes_producto (id, producto_id, url_imagen)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [imagenId, productId, url_imagen]
    );

    res.status(201).json({
      ok: true,
      message: "Imagen agregada",
      imagen: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createImagen:", error);
    res.status(500).json({
      ok: false,
      message: "Error al agregar imagen",
      error: error.message,
    });
  }
};

exports.deleteImagen = async (req, res) => {
  try {
    const userId = req.userId;
    const { imagenId } = req.params;

    // Obtener la imagen y verificar el producto
    const imagenResult = await pool.query(
      "SELECT ip.id, ip.producto_id, p.usuario_id FROM imagenes_producto ip JOIN productos p ON ip.producto_id = p.id WHERE ip.id = $1",
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
      "DELETE FROM imagenes_producto WHERE id = $1",
      [imagenId]
    );

    res.json({
      ok: true,
      message: "Imagen eliminada",
    });
  } catch (error) {
    console.error("Error en deleteImagen:", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar imagen",
      error: error.message,
    });
  }
};

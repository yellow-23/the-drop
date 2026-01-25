const pool = require("../db");

exports.getVariantes = async (req, res) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `SELECT 
        vp.id,
        vp.producto_id,
        vp.talla_id,
        tc.talla_cl,
        vp.precio_clp,
        vp.stock
       FROM variantes_producto vp
       LEFT JOIN tallas_cl tc ON vp.talla_id = tc.id
       WHERE vp.producto_id = $1
       ORDER BY tc.talla_cl ASC`,
      [productId]
    );

    res.json({
      ok: true,
      variantes: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error en getVariantes:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener variantes",
      error: error.message,
    });
  }
};

exports.createVariante = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.params;
    const { talla_id, precio_clp, stock } = req.body;

    if (!talla_id || !precio_clp || stock === undefined) {
      return res.status(400).json({
        ok: false,
        message: "talla_id, precio_clp y stock son requeridos",
      });
    }

    // Verificar que el producto pertenece al usuario
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
        message: "No autorizado para crear variantes de este producto",
      });
    }

    // Verificar que la talla existe
    const tallaResult = await pool.query(
      "SELECT id FROM tallas_cl WHERE id = $1",
      [talla_id]
    );

    if (tallaResult.rows.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Talla no válida",
      });
    }

    // Verificar que no existe ya una variante con esa talla
    const existingVariante = await pool.query(
      "SELECT id FROM variantes_producto WHERE producto_id = $1 AND talla_id = $2",
      [productId, talla_id]
    );

    if (existingVariante.rows.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Ya existe una variante con esta talla",
      });
    }

    const varianteId = Date.now();

    const result = await pool.query(
      `INSERT INTO variantes_producto (id, producto_id, talla_id, precio_clp, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [varianteId, productId, talla_id, precio_clp, stock]
    );

    res.status(201).json({
      ok: true,
      message: "Variante creada exitosamente",
      variante: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createVariante:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear variante",
      error: error.message,
    });
  }
};

exports.updateVariante = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, varianteId } = req.params;
    const { precio_clp, stock } = req.body;

    if (precio_clp === undefined && stock === undefined) {
      return res.status(400).json({
        ok: false,
        message: "Debe proporcionar al menos precio_clp o stock",
      });
    }

    // Verificar que el producto pertenece al usuario
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
        message: "No autorizado para actualizar variantes de este producto",
      });
    }

    // Verificar que la variante existe y pertenece al producto
    const varianteResult = await pool.query(
      "SELECT * FROM variantes_producto WHERE id = $1 AND producto_id = $2",
      [varianteId, productId]
    );

    if (varianteResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Variante no encontrada",
      });
    }

    const currentVariante = varianteResult.rows[0];
    const newPrecio = precio_clp !== undefined ? precio_clp : currentVariante.precio_clp;
    const newStock = stock !== undefined ? stock : currentVariante.stock;

    const result = await pool.query(
      `UPDATE variantes_producto 
       SET precio_clp = $1, stock = $2
       WHERE id = $3
       RETURNING *`,
      [newPrecio, newStock, varianteId]
    );

    res.json({
      ok: true,
      message: "Variante actualizada",
      variante: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateVariante:", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar variante",
      error: error.message,
    });
  }
};

exports.deleteVariante = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId, varianteId } = req.params;

    // Verificar que el producto pertenece al usuario
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
        message: "No autorizado para eliminar variantes de este producto",
      });
    }

    // Verificar que la variante existe y pertenece al producto
    const varianteResult = await pool.query(
      "SELECT * FROM variantes_producto WHERE id = $1 AND producto_id = $2",
      [varianteId, productId]
    );

    if (varianteResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Variante no encontrada",
      });
    }

    const carroItems = await pool.query(
      "SELECT COUNT(*) as count FROM items_carrito WHERE variante_producto_id = $1",
      [varianteId]
    );

    if (carroItems.rows[0].count > 0) {
      return res.status(400).json({
        ok: false,
        message: "No se puede eliminar variante porque hay items en carritos",
      });
    }

    const ordenItems = await pool.query(
      "SELECT COUNT(*) as count FROM items_orden WHERE variante_producto_id = $1",
      [varianteId]
    );

    if (ordenItems.rows[0].count > 0) {
      return res.status(400).json({
        ok: false,
        message: "No se puede eliminar variante porque hay órdenes que la utilizan",
      });
    }

    await pool.query(
      "DELETE FROM variantes_producto WHERE id = $1",
      [varianteId]
    );

    res.json({
      ok: true,
      message: "Variante eliminada",
    });
  } catch (error) {
    console.error("Error en deleteVariante:", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar variante",
      error: error.message,
    });
  }
};

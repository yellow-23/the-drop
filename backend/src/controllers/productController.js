const pool = require("../db");

exports.getAllProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.id, 
        p.titulo, 
        p.modelo, 
        p.descripcion,
        m.nombre as marca,
        p.creado_en,
        u.nombre as usuario
      FROM productos p
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.creado_en DESC
    `);

    res.json({
      ok: true,
      products: result.rows,
    });
  } catch (error) {
    console.error("Error en getAllProducts:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener productos",
      error: error.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      SELECT 
        p.id, 
        p.titulo, 
        p.modelo, 
        p.descripcion,
        m.nombre as marca,
        p.creado_en,
        u.nombre as usuario,
        (SELECT json_agg(json_build_object('talla', t.talla_cl, 'precio', vp.precio_clp, 'stock', vp.stock))
         FROM variantes_producto vp
         LEFT JOIN tallas_cl t ON vp.talla_id = t.id
         WHERE vp.producto_id = p.id) as variantes,
        (SELECT json_agg(url_imagen)
         FROM imagenes_producto
         WHERE producto_id = p.id) as imagenes
      FROM productos p
      LEFT JOIN marcas m ON p.marca_id = m.id
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    res.json({
      ok: true,
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error en getProductById:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener producto",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { titulo, modelo, descripcion, marca_id } = req.body;
    const userId = req.userId;

    if (!titulo || !modelo) {
      return res.status(400).json({
        ok: false,
        message: "Título y modelo requeridos",
      });
    }

    const productId = Date.now();

    const result = await pool.query(
      `INSERT INTO productos (id, usuario_id, marca_id, titulo, modelo, descripcion, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [productId, userId, marca_id || null, titulo, modelo, descripcion || null, new Date()]
    );

    res.status(201).json({
      ok: true,
      message: "Producto creado",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createProduct:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear producto",
      error: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, modelo, descripcion, marca_id } = req.body;
    const userId = req.userId;

    const ownerCheck = await pool.query(
      "SELECT usuario_id FROM productos WHERE id = $1",
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    if (ownerCheck.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permiso para actualizar este producto",
      });
    }

    const result = await pool.query(
      `UPDATE productos 
       SET titulo = COALESCE($2, titulo),
           modelo = COALESCE($3, modelo),
           descripcion = COALESCE($4, descripcion),
           marca_id = COALESCE($5, marca_id)
       WHERE id = $1
       RETURNING *`,
      [id, titulo, modelo, descripcion, marca_id]
    );

    res.json({
      ok: true,
      message: "Producto actualizado",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateProduct:", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const ownerCheck = await pool.query(
      "SELECT usuario_id FROM productos WHERE id = $1",
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Producto no encontrado",
      });
    }

    if (ownerCheck.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permiso para eliminar este producto",
      });
    }

    await pool.query("DELETE FROM productos WHERE id = $1", [id]);

    res.json({
      ok: true,
      message: "Producto eliminado",
    });
  } catch (error) {
    console.error("Error en deleteProduct:", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};

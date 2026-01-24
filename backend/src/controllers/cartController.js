const pool = require("../db");

exports.getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const cartResult = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = $1",
      [userId]
    );

    let carroId;
    if (cartResult.rows.length === 0) {
      const newCartResult = await pool.query(
        "INSERT INTO carritos (id, usuario_id, creado_en) VALUES ($1, $2, $3) RETURNING id",
        [Date.now(), userId, new Date()]
      );
      carroId = newCartResult.rows[0].id;
    } else {
      carroId = cartResult.rows[0].id;
    }

    const itemsResult = await pool.query(`
      SELECT 
        ic.id,
        ic.tipo_item,
        ic.cantidad,
        CASE 
          WHEN ic.tipo_item = 'producto' THEN vp.precio_clp
          WHEN ic.tipo_item = 'publicacion' THEN pu.precio_clp
        END as precio,
        CASE 
          WHEN ic.tipo_item = 'producto' THEN p.titulo
          WHEN ic.tipo_item = 'publicacion' THEN pu.titulo
        END as titulo,
        CASE 
          WHEN ic.tipo_item = 'producto' THEN ic.variante_producto_id
          WHEN ic.tipo_item = 'publicacion' THEN ic.publicacion_id
        END as item_id
      FROM items_carrito ic
      LEFT JOIN variantes_producto vp ON ic.variante_producto_id = vp.id
      LEFT JOIN productos p ON vp.producto_id = p.id
      LEFT JOIN publicaciones_usuario pu ON ic.publicacion_id = pu.id
      WHERE ic.carrito_id = $1
    `, [carroId]);

    const total = itemsResult.rows.reduce((sum, item) => {
      return sum + (item.precio * item.cantidad);
    }, 0);

    res.json({
      ok: true,
      carroId,
      items: itemsResult.rows,
      total,
      itemCount: itemsResult.rows.length,
    });
  } catch (error) {
    console.error("Error en getCart:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener carrito",
      error: error.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { tipo_item, variante_producto_id, publicacion_id, cantidad } = req.body;

    if (!tipo_item || !cantidad) {
      return res.status(400).json({
        ok: false,
        message: "tipo_item y cantidad son requeridos",
      });
    }

    if (tipo_item === "producto" && !variante_producto_id) {
      return res.status(400).json({
        ok: false,
        message: "variante_producto_id requerido para tipo producto",
      });
    }

    if (tipo_item === "publicacion" && !publicacion_id) {
      return res.status(400).json({
        ok: false,
        message: "publicacion_id requerido para tipo publicacion",
      });
    }

    let carroId = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = $1",
      [userId]
    );

    if (carroId.rows.length === 0) {
      const newCart = await pool.query(
        "INSERT INTO carritos (id, usuario_id, creado_en) VALUES ($1, $2, $3) RETURNING id",
        [Date.now(), userId, new Date()]
      );
      carroId = newCart.rows[0].id;
    } else {
      carroId = carroId.rows[0].id;
    }

    const existingItem = await pool.query(
      `SELECT * FROM items_carrito 
       WHERE carrito_id = $1 AND tipo_item = $2 
       AND (variante_producto_id = $3 OR publicacion_id = $4)`,
      [carroId, tipo_item, variante_producto_id || null, publicacion_id || null]
    );

    if (existingItem.rows.length > 0) {
      const updated = await pool.query(
        "UPDATE items_carrito SET cantidad = cantidad + $1 WHERE id = $2 RETURNING *",
        [cantidad, existingItem.rows[0].id]
      );

      return res.json({
        ok: true,
        message: "Item actualizado en carrito",
        item: updated.rows[0],
      });
    }

    const result = await pool.query(
      `INSERT INTO items_carrito (id, carrito_id, tipo_item, variante_producto_id, publicacion_id, cantidad, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [Date.now(), carroId, tipo_item, variante_producto_id || null, publicacion_id || null, cantidad, new Date()]
    );

    res.status(201).json({
      ok: true,
      message: "Item agregado al carrito",
      item: result.rows[0],
    });
  } catch (error) {
    console.error("Error en addToCart:", error);
    res.status(500).json({
      ok: false,
      message: "Error al agregar al carrito",
      error: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const result = await pool.query(
      "DELETE FROM items_carrito WHERE id = $1 RETURNING *",
      [itemId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Item no encontrado en carrito",
      });
    }

    res.json({
      ok: true,
      message: "Item removido del carrito",
    });
  } catch (error) {
    console.error("Error en removeFromCart:", error);
    res.status(500).json({
      ok: false,
      message: "Error al remover del carrito",
      error: error.message,
    });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.userId;

    const carroResult = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = $1",
      [userId]
    );

    if (carroResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Carrito no encontrado",
      });
    }

    const carroId = carroResult.rows[0].id;

    await pool.query(
      "DELETE FROM items_carrito WHERE carrito_id = $1",
      [carroId]
    );

    res.json({
      ok: true,
      message: "Carrito vaciado",
    });
  } catch (error) {
    console.error("Error en clearCart:", error);
    res.status(500).json({
      ok: false,
      message: "Error al vaciar carrito",
      error: error.message,
    });
  }
};

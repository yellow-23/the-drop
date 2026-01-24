const pool = require("../db");

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { region_envio, comuna_envio } = req.body;

    if (!region_envio || !comuna_envio) {
      return res.status(400).json({
        ok: false,
        message: "region_envio y comuna_envio son requeridos",
      });
    }

    const carroResult = await pool.query(
      "SELECT id FROM carritos WHERE usuario_id = $1",
      [userId]
    );

    if (carroResult.rows.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Carrito vacío",
      });
    }

    const carroId = carroResult.rows[0].id;

    const itemsResult = await pool.query(
      `SELECT 
        ic.tipo_item,
        ic.variante_producto_id,
        ic.publicacion_id,
        ic.cantidad,
        CASE 
          WHEN ic.tipo_item = 'producto' THEN vp.precio_clp
          WHEN ic.tipo_item = 'publicacion' THEN pu.precio_clp
        END as precio
       FROM items_carrito ic
       LEFT JOIN variantes_producto vp ON ic.variante_producto_id = vp.id
       LEFT JOIN publicaciones_usuario pu ON ic.publicacion_id = pu.id
       WHERE ic.carrito_id = $1`,
      [carroId]
    );

    if (itemsResult.rows.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Carrito sin items",
      });
    }

    const totalClp = itemsResult.rows.reduce((sum, item) => {
      return sum + (item.precio * item.cantidad);
    }, 0);

    const ordenId = Date.now();

    const ordenResult = await pool.query(
      `INSERT INTO ordenes (id, usuario_id, total_clp, estado, region_envio, comuna_envio, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [ordenId, userId, totalClp, "pendiente", region_envio, comuna_envio, new Date()]
    );

    for (const item of itemsResult.rows) {
      await pool.query(
        `INSERT INTO items_orden (id, orden_id, tipo_item, variante_producto_id, publicacion_id, cantidad, precio_snapshot_clp)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [Date.now(), ordenId, item.tipo_item, item.variante_producto_id || null, item.publicacion_id || null, item.cantidad, item.precio]
      );
    }

    await pool.query("DELETE FROM items_carrito WHERE carrito_id = $1", [carroId]);

    res.status(201).json({
      ok: true,
      message: "Orden creada exitosamente",
      order: ordenResult.rows[0],
    });
  } catch (error) {
    console.error("Error en createOrder:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear orden",
      error: error.message,
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        o.id,
        o.total_clp,
        o.estado,
        o.region_envio,
        o.comuna_envio,
        o.creado_en,
        (SELECT COUNT(*) FROM items_orden WHERE orden_id = o.id) as item_count
       FROM ordenes o
       WHERE o.usuario_id = $1
       ORDER BY o.creado_en DESC`,
      [userId]
    );

    res.json({
      ok: true,
      orders: result.rows,
    });
  } catch (error) {
    console.error("Error en getUserOrders:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener órdenes",
      error: error.message,
    });
  }
};

exports.getOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.userId;

    const ordenResult = await pool.query(
      "SELECT * FROM ordenes WHERE id = $1 AND usuario_id = $2",
      [orderId, userId]
    );

    if (ordenResult.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Orden no encontrada",
      });
    }

    const itemsResult = await pool.query(
      `SELECT 
        io.id,
        io.tipo_item,
        io.cantidad,
        io.precio_snapshot_clp,
        CASE 
          WHEN io.tipo_item = 'producto' THEN p.titulo
          WHEN io.tipo_item = 'publicacion' THEN pu.titulo
        END as titulo
       FROM items_orden io
       LEFT JOIN variantes_producto vp ON io.variante_producto_id = vp.id
       LEFT JOIN productos p ON vp.producto_id = p.id
       LEFT JOIN publicaciones_usuario pu ON io.publicacion_id = pu.id
       WHERE io.orden_id = $1`,
      [orderId]
    );

    res.json({
      ok: true,
      order: {
        ...ordenResult.rows[0],
        items: itemsResult.rows,
      },
    });
  } catch (error) {
    console.error("Error en getOrderDetail:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener detalle de orden",
      error: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { estado } = req.body;

    const estadosValidos = ["pendiente", "confirmada", "enviada", "entregada", "cancelada"];

    if (!estado || !estadosValidos.includes(estado)) {
      return res.status(400).json({
        ok: false,
        message: `Estado debe ser uno de: ${estadosValidos.join(", ")}`,
      });
    }

    const result = await pool.query(
      "UPDATE ordenes SET estado = $1 WHERE id = $2 RETURNING *",
      [estado, orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Orden no encontrada",
      });
    }

    res.json({
      ok: true,
      message: "Estado actualizado",
      order: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updateOrderStatus:", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar estado",
      error: error.message,
    });
  }
};

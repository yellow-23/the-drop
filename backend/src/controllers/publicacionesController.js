const pool = require("../db");

exports.getPublicaciones = async (req, res) => {
  try {
    const { search, marca_id, talla_id, precio_min, precio_max } = req.query;

    let query = `
      SELECT 
        pu.id,
        pu.titulo,
        pu.modelo,
        pu.condicion,
        pu.precio_clp,
        pu.descripcion,
        pu.estado,
        pu.region,
        pu.comuna,
        pu.co2_ahorrado_kg,
        pu.veces_revendido,
        m.nombre as marca,
        tc.talla_cl as talla,
        u.nombre as usuario,
        u.reputacion,
        pu.creado_en
      FROM publicaciones_usuario pu
      LEFT JOIN marcas m ON pu.marca_id = m.id
      LEFT JOIN tallas_cl tc ON pu.talla_id = tc.id
      LEFT JOIN usuarios u ON pu.usuario_id = u.id
      WHERE pu.estado = 'activa'
    `;

    const conditions = [];
    const params = [];
    let paramCount = 1;

    if (search) {
      conditions.push(`(pu.titulo ILIKE $${paramCount} OR pu.modelo ILIKE $${paramCount} OR pu.descripcion ILIKE $${paramCount})`);
      params.push(`%${search}%`);
      paramCount++;
    }

    if (marca_id) {
      conditions.push(`pu.marca_id = $${paramCount}`);
      params.push(marca_id);
      paramCount++;
    }

    if (talla_id) {
      conditions.push(`pu.talla_id = $${paramCount}`);
      params.push(talla_id);
      paramCount++;
    }

    if (precio_min || precio_max) {
      if (precio_min) {
        conditions.push(`pu.precio_clp >= $${paramCount}`);
        params.push(precio_min);
        paramCount++;
      }
      if (precio_max) {
        conditions.push(`pu.precio_clp <= $${paramCount}`);
        params.push(precio_max);
        paramCount++;
      }
    }

    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    query += " ORDER BY pu.creado_en DESC";

    const result = await pool.query(query, params);

    res.json({
      ok: true,
      publicaciones: result.rows,
    });
  } catch (error) {
    console.error("Error en getPublicaciones:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener publicaciones",
      error: error.message,
    });
  }
};

exports.getPublicacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
        pu.id,
        pu.titulo,
        pu.modelo,
        pu.condicion,
        pu.precio_clp,
        pu.descripcion,
        pu.estado,
        pu.region,
        pu.comuna,
        pu.co2_ahorrado_kg,
        pu.veces_revendido,
        pu.tipo_entrega,
        m.nombre as marca,
        tc.talla_cl as talla,
        u.nombre as usuario,
        u.reputacion,
        (SELECT json_agg(url_imagen)
         FROM imagenes_publicacion_usuario
         WHERE publicacion_id = pu.id) as imagenes,
        pu.creado_en
       FROM publicaciones_usuario pu
       LEFT JOIN marcas m ON pu.marca_id = m.id
       LEFT JOIN tallas_cl tc ON pu.talla_id = tc.id
       LEFT JOIN usuarios u ON pu.usuario_id = u.id
       WHERE pu.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Publicación no encontrada",
      });
    }

    res.json({
      ok: true,
      publicacion: result.rows[0],
    });
  } catch (error) {
    console.error("Error en getPublicacionById:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener publicación",
      error: error.message,
    });
  }
};

exports.createPublicacion = async (req, res) => {
  try {
    const userId = req.userId;
    const { titulo, modelo, condicion, precio_clp, descripcion, region, comuna, marca_id, talla_id, tipo_entrega } = req.body;

    if (!titulo || !modelo || !precio_clp) {
      return res.status(400).json({
        ok: false,
        message: "Título, modelo y precio son requeridos",
      });
    }

    const publicacionId = Date.now();

    const result = await pool.query(
      `INSERT INTO publicaciones_usuario (id, usuario_id, marca_id, talla_id, titulo, modelo, condicion, precio_clp, descripcion, estado, region, comuna, tipo_entrega, creado_en)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [publicacionId, userId, marca_id || null, talla_id || null, titulo, modelo, condicion || "sin especificar", precio_clp, descripcion || null, "activa", region || null, comuna || null, tipo_entrega || null, new Date()]
    );

    res.status(201).json({
      ok: true,
      message: "Publicación creada",
      publicacion: result.rows[0],
    });
  } catch (error) {
    console.error("Error en createPublicacion:", error);
    res.status(500).json({
      ok: false,
      message: "Error al crear publicación",
      error: error.message,
    });
  }
};

exports.updatePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { titulo, modelo, condicion, precio_clp, descripcion, region, comuna, tipo_entrega } = req.body;

    const ownerCheck = await pool.query(
      "SELECT usuario_id FROM publicaciones_usuario WHERE id = $1",
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Publicación no encontrada",
      });
    }

    if (ownerCheck.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permiso para actualizar esta publicación",
      });
    }

    const result = await pool.query(
      `UPDATE publicaciones_usuario 
       SET titulo = COALESCE($2, titulo),
           modelo = COALESCE($3, modelo),
           condicion = COALESCE($4, condicion),
           precio_clp = COALESCE($5, precio_clp),
           descripcion = COALESCE($6, descripcion),
           region = COALESCE($7, region),
           comuna = COALESCE($8, comuna),
           tipo_entrega = COALESCE($9, tipo_entrega)
       WHERE id = $1
       RETURNING *`,
      [id, titulo, modelo, condicion, precio_clp, descripcion, region, comuna, tipo_entrega]
    );

    res.json({
      ok: true,
      message: "Publicación actualizada",
      publicacion: result.rows[0],
    });
  } catch (error) {
    console.error("Error en updatePublicacion:", error);
    res.status(500).json({
      ok: false,
      message: "Error al actualizar publicación",
      error: error.message,
    });
  }
};

exports.deletePublicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const ownerCheck = await pool.query(
      "SELECT usuario_id FROM publicaciones_usuario WHERE id = $1",
      [id]
    );

    if (ownerCheck.rows.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "Publicación no encontrada",
      });
    }

    if (ownerCheck.rows[0].usuario_id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "No tienes permiso para eliminar esta publicación",
      });
    }

    await pool.query(
      "UPDATE publicaciones_usuario SET estado = 'inactiva' WHERE id = $1",
      [id]
    );

    res.json({
      ok: true,
      message: "Publicación eliminada",
    });
  } catch (error) {
    console.error("Error en deletePublicacion:", error);
    res.status(500).json({
      ok: false,
      message: "Error al eliminar publicación",
      error: error.message,
    });
  }
};

exports.getPublicacionesUsuario = async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `SELECT 
        id,
        titulo,
        modelo,
        precio_clp,
        estado,
        creado_en
       FROM publicaciones_usuario
       WHERE usuario_id = $1
       ORDER BY creado_en DESC`,
      [userId]
    );

    res.json({
      ok: true,
      publicaciones: result.rows,
    });
  } catch (error) {
    console.error("Error en getPublicacionesUsuario:", error);
    res.status(500).json({
      ok: false,
      message: "Error al obtener publicaciones",
      error: error.message,
    });
  }
};

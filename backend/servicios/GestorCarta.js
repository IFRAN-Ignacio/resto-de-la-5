// Gestor de la carta: coordina las operaciones sobre platos y categorías.
// Es el equivalente a los "Gestores" del diagrama de clases.
const pool = require("../db");
const Plato = require("../modelos/Plato");
const Categoria = require("../modelos/Categoria");

class ErrorValidacion extends Error {
  constructor(errores) {
    super(errores.join(" "));
    this.errores = errores;
    this.status = 400;
  }
}

class GestorCarta {
  async listarCategorias() {
    const [filas] = await pool.query("SELECT id, nombre FROM categoria ORDER BY orden, nombre");
    return filas.map((f) => new Categoria(f));
  }

  async listarPlatos({ incluirInactivos = false } = {}) {
    const [filas] = await pool.query(
      `SELECT p.id, p.nombre, p.descripcion, p.precio, p.activo, p.categoria_id, c.nombre AS categoria
         FROM plato p JOIN categoria c ON c.id = p.categoria_id
        ${incluirInactivos ? "" : "WHERE p.activo = 1"}
        ORDER BY c.orden, c.nombre, p.nombre`
    );
    return filas.map((f) => new Plato(f));
  }

  // Carta agrupada por categoría (criterio de aceptación de US2.2).
  async cartaAgrupada(opciones) {
    const [categorias, platos] = await Promise.all([this.listarCategorias(), this.listarPlatos(opciones)]);
    return categorias.map((c) => ({
      categoria: c,
      platos: platos.filter((p) => p.categoriaId === c.id),
    }));
  }

  async #existeCategoria(id) {
    const [f] = await pool.query("SELECT id FROM categoria WHERE id = ?", [id]);
    return f.length > 0;
  }

  async #validar(plato) {
    const errores = plato.validar();
    if (!errores.length && !(await this.#existeCategoria(plato.categoriaId))) errores.push("La categoría no existe.");
    if (errores.length) throw new ErrorValidacion(errores);
  }

  async crearPlato(datos) {
    const plato = new Plato({ ...datos, activo: true });
    await this.#validar(plato);
    const [r] = await pool.query(
      "INSERT INTO plato (nombre, descripcion, precio, activo, categoria_id) VALUES (?, ?, ?, 1, ?)",
      [plato.nombre, plato.descripcion, plato.precio, plato.categoriaId]
    );
    plato.id = r.insertId;
    return plato;
  }

  async modificarPlato(id, datos) {
    const plato = new Plato({ ...datos, id: Number(id) });
    await this.#validar(plato);
    const [r] = await pool.query(
      "UPDATE plato SET nombre = ?, descripcion = ?, precio = ?, categoria_id = ? WHERE id = ?",
      [plato.nombre, plato.descripcion, plato.precio, plato.categoriaId, plato.id]
    );
    if (r.affectedRows === 0) return null;
    return this.buscarPlato(plato.id);
  }

  async buscarPlato(id) {
    const [f] = await pool.query("SELECT id, nombre, descripcion, precio, activo, categoria_id FROM plato WHERE id = ?", [Number(id)]);
    return f.length ? new Plato(f[0]) : null;
  }

  // No se borra el plato: se desactiva para no perder el historial de pedidos.
  async cambiarEstado(id, activo) {
    const [r] = await pool.query("UPDATE plato SET activo = ? WHERE id = ?", [activo ? 1 : 0, Number(id)]);
    return r.affectedRows > 0;
  }
}

module.exports = { GestorCarta, ErrorValidacion };

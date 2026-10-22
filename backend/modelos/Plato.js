// Clase del diagrama de clases (paquete "Salón y carta").
// Contiene las reglas propias del plato (criterios de aceptación de US2.2).
class Plato {
  constructor({ id = null, nombre, descripcion = "", precio, activo = true, categoria_id, categoria = null }) {
    this.id = id;
    this.nombre = typeof nombre === "string" ? nombre.trim() : nombre;
    this.descripcion = typeof descripcion === "string" ? descripcion.trim() : "";
    this.precio = Number(precio);
    this.activo = Boolean(activo);
    this.categoriaId = Number(categoria_id);
    this.categoria = categoria;
  }

  // Devuelve la lista de errores de validación (vacía si el plato es válido).
  validar() {
    const errores = [];
    if (!this.nombre) errores.push("El nombre es obligatorio.");
    else if (this.nombre.length > 80) errores.push("El nombre no puede superar los 80 caracteres.");
    if (!Number.isFinite(this.precio) || this.precio <= 0) errores.push("El precio debe ser mayor a 0.");
    if (!Number.isInteger(this.categoriaId) || this.categoriaId <= 0) errores.push("Hay que elegir una categoría.");
    return errores;
  }

  // Un plato desactivado no aparece para tomar pedidos (no se borra: se conserva el historial).
  estaDisponible() {
    return this.activo;
  }
}

module.exports = Plato;

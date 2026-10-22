// API REST de la carta (tarea T2.2.2).
const express = require("express");
const { GestorCarta } = require("../servicios/GestorCarta");

const router = express.Router();
const gestor = new GestorCarta();

// Envuelve los handlers async para mandar los errores al manejador central.
const h = (fn) => (req, res, next) => fn(req, res).catch(next);

router.get("/categorias", h(async (req, res) => {
  res.json(await gestor.listarCategorias());
}));

// GET /api/carta            -> solo platos activos, agrupados por categoría
// GET /api/carta?todos=1    -> incluye los desactivados (para la administración)
router.get("/carta", h(async (req, res) => {
  res.json(await gestor.cartaAgrupada({ incluirInactivos: req.query.todos === "1" }));
}));

router.post("/platos", h(async (req, res) => {
  res.status(201).json(await gestor.crearPlato(req.body));
}));

router.put("/platos/:id", h(async (req, res) => {
  const plato = await gestor.modificarPlato(req.params.id, req.body);
  if (!plato) return res.status(404).json({ error: "El plato no existe." });
  res.json(plato);
}));

router.patch("/platos/:id/desactivar", h(async (req, res) => {
  if (!(await gestor.cambiarEstado(req.params.id, false))) return res.status(404).json({ error: "El plato no existe." });
  res.json({ ok: true });
}));

router.patch("/platos/:id/activar", h(async (req, res) => {
  if (!(await gestor.cambiarEstado(req.params.id, true))) return res.status(404).json({ error: "El plato no existe." });
  res.json({ ok: true });
}));

module.exports = router;

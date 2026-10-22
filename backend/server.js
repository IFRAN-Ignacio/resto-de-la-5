// Servidor principal: sirve la API y el frontend.
const path = require("path");
const express = require("express");
const { puerto } = require("./config");
const pool = require("./db");
const cartaRutas = require("./rutas/carta.rutas");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use("/api", cartaRutas);

// Manejador central de errores.
app.use((err, req, res, next) => {
  if (err.status === 400) return res.status(400).json({ error: err.message, errores: err.errores });
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

async function iniciar() {
  try {
    await pool.query("SELECT 1");
  } catch (e) {
    console.error("\n No se pudo conectar a MySQL.");
    console.error(" -> Revisá que MySQL esté iniciado en XAMPP y que hayas corrido: npm run db:init\n");
    console.error(" Detalle:", e.message);
    process.exit(1);
  }
  app.listen(puerto, () => {
    console.log(`\n El restó de la 5 funcionando en http://localhost:${puerto}`);
    console.log(` Carta de platos: http://localhost:${puerto}/carta.html\n`);
  });
}

iniciar();

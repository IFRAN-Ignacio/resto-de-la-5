// Crea la base de datos, las tablas y los datos de ejemplo.
// Uso: npm run db:init   (con MySQL de XAMPP iniciado)
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const { db } = require("../backend/config");

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8")
    .replaceAll("resto_de_la_5", db.database);
  let con;
  try {
    con = await mysql.createConnection({ host: db.host, port: db.port, user: db.user, password: db.password, multipleStatements: true });
    await con.query(sql);
    console.log(`\n Base de datos "${db.database}" lista (tablas categoria y plato con datos de ejemplo).\n`);
  } catch (e) {
    console.error("\n No se pudo inicializar la base de datos.");
    console.error(" -> Revisá que MySQL esté iniciado en el panel de XAMPP (botón Start en MySQL).\n");
    console.error(" Detalle:", e.message);
    process.exitCode = 1;
  } finally {
    if (con) await con.end();
  }
})();

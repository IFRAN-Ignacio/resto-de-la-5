// Configuración de la conexión a MySQL.
// Valores por defecto pensados para XAMPP (usuario root sin contraseña).
// Se pueden cambiar con variables de entorno sin tocar el código.
module.exports = {
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "resto_de_la_5",
  },
  puerto: Number(process.env.PORT || 3000),
};

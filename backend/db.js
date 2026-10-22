// Pool de conexiones a MySQL (se reutiliza en todo el backend).
const mysql = require("mysql2/promise");
const { db } = require("./config");

const pool = mysql.createPool({ ...db, waitForConnections: true, connectionLimit: 10 });

module.exports = pool;

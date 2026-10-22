-- Base de datos de «El restó de la 5» - Sprint 1 (tarea T2.2.1: tablas de platos y categorías)
-- Coincide con el modelo de datos (diagrama 13_der.png).

CREATE DATABASE IF NOT EXISTS resto_de_la_5 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE resto_de_la_5;

CREATE TABLE IF NOT EXISTS categoria (
  id     INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(40) NOT NULL UNIQUE,
  orden  INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS plato (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  nombre       VARCHAR(80)  NOT NULL,
  descripcion  VARCHAR(255) NOT NULL DEFAULT '',
  precio       DECIMAL(10,2) NOT NULL CHECK (precio > 0),
  activo       TINYINT(1)   NOT NULL DEFAULT 1,
  categoria_id INT NOT NULL,
  CONSTRAINT fk_plato_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

-- Datos de ejemplo (solo se cargan si las tablas están vacías)
INSERT INTO categoria (nombre, orden)
SELECT * FROM (SELECT 'Entradas', 1 UNION ALL SELECT 'Principales', 2 UNION ALL SELECT 'Postres', 3 UNION ALL SELECT 'Bebidas', 4) t
WHERE NOT EXISTS (SELECT 1 FROM categoria);

INSERT INTO plato (nombre, descripcion, precio, categoria_id)
SELECT t.nombre, t.descripcion, t.precio, c.id FROM (
  SELECT 'Empanadas de carne' AS nombre, 'Docena, al horno' AS descripcion, 9600 AS precio, 'Entradas' AS cat
  UNION ALL SELECT 'Rabas', 'Porción con limón', 11500, 'Entradas'
  UNION ALL SELECT 'Milanesa con papas', 'Milanesa de ternera con papas fritas', 13500, 'Principales'
  UNION ALL SELECT 'Ravioles con tuco', 'Ravioles de verdura caseros', 12000, 'Principales'
  UNION ALL SELECT 'Flan casero', 'Con dulce de leche', 5500, 'Postres'
  UNION ALL SELECT 'Agua mineral', '500 ml', 2500, 'Bebidas'
  UNION ALL SELECT 'Gaseosa', '500 ml', 3000, 'Bebidas'
) t JOIN categoria c ON c.nombre = t.cat
WHERE NOT EXISTS (SELECT 1 FROM plato);

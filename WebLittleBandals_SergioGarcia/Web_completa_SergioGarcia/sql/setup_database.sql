-- Crear base de datos
CREATE DATABASE IF NOT EXISTS little_bandals CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE little_bandals;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    imagen_frontal VARCHAR(255) NOT NULL,
    imagen_trasera VARCHAR(255) NOT NULL,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla del carrito
CREATE TABLE IF NOT EXISTS carrito (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT DEFAULT 1,
    fecha_agregado DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_producto (usuario_id, producto_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar productos de ejemplo (basados en shop.html)
INSERT INTO productos (nombre, precio, imagen_frontal, imagen_trasera) VALUES
('Bandal 1', 15.00, '../imagenes/Bandal_1.png', '../imagenes/Packaging.png'),
('Bandal 2', 22.00, '../imagenes/Bandal_2.png', '../imagenes/Packaging.png'),
('Bandal 3', 35.00, '../imagenes/Bandal_3.png', '../imagenes/Packaging.png'),
('Bandal 4', 28.00, '../imagenes/Bandal_4.png', '../imagenes/Packaging.png'),
('Bandal 5', 40.00, '../imagenes/Bandal_5.png', '../imagenes/Packaging.png'),
('Bandal 6', 18.00, '../imagenes/Bandal_6.png', '../imagenes/Packaging.png'),
('Bandal 7', 55.00, '../imagenes/Bandal_7.png', '../imagenes/Packaging.png'),
('Bandal 8', 60.00, '../imagenes/Bandal_8.png', '../imagenes/Packaging.png'),
('Bandal 9', 12.00, '../imagenes/Bandal_9.png', '../imagenes/Packaging.png'),
('Bandal 10', 30.00, '../imagenes/Bandal_10.png', '../imagenes/Packaging.png'),
('Bandal 11', 25.00, '../imagenes/Bandal_11.png', '../imagenes/Packaging.png');
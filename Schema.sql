CREATE DATABASE eventos_db;

USE eventos_db;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    apodo VARCHAR(20) NOT NULL,
    correo VARCHAR(250) NOT NULL,
    contra VARCHAR(10) NOT NULL
);

-- Tabla de lista de amigos
CREATE TABLE listaamigos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT,
    idamigo INT,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id),
    FOREIGN KEY (idamigo) REFERENCES usuarios(id)
);

-- Tabla de tipos de eventos
CREATE TABLE tipo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(30)
);

-- Tabla de eventos
CREATE TABLE eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idusuario INT,
    nombreEvento VARCHAR(30) NOT NULL,
    descripcion VARCHAR(200),
    idtipo INT,
    dia DATE NOT NULL,
    localizacion VARCHAR(200),
    foto LONGBLOB,
    FOREIGN KEY (idusuario) REFERENCES usuarios(id),
    FOREIGN KEY (idtipo) REFERENCES tipo(id)
);

-- Tabla de itinerarios
CREATE TABLE itinerario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idevento INT,
    hora DATETIME NOT NULL,
    concepto VARCHAR(100) NOT NULL,
    peticion VARCHAR(200),
    FOREIGN KEY (idevento) REFERENCES eventos(id)
);

-- Tabla de invitaciones
CREATE TABLE invitacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idevento INT,
    peticion VARCHAR(200),
    idusuario INT,
    limiteacept DATE NOT NULL,
    FOREIGN KEY (idevento) REFERENCES eventos(id),
    FOREIGN KEY (idusuario) REFERENCES usuarios(id)
);

-- Tabla de álbumes
CREATE TABLE album (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foto LONGBLOB NOT NULL,
    descripcion VARCHAR(200),
    hora DATETIME,
    idevento INT,
    FOREIGN KEY (idevento) REFERENCES eventos(id)
);


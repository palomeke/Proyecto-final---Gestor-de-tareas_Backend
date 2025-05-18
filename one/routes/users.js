import express from "express";
import fs from "fs";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cargar usuarios desde el archivo
let usuarios = JSON.parse(fs.readFileSync("./users.json"));

// Obtener todos los usuarios o filtrar por nombre, edad o ambos
router.get("/", verificarToken, (req, res) => {
  const { nombre, edad, page = 1, limit = 5 } = req.query;
  let filtrados = usuarios;

  if (nombre) {
    filtrados = filtrados.filter((u) =>
      u.nombre.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  if (edad) {
    filtrados = filtrados.filter((u) => u.edad == edad);
  }

  // Paginación
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const resultadosPaginados = filtrados.slice(startIndex, endIndex);

  res.json({
    total: filtrados.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: resultadosPaginados,
  });
});

// Obtener usuario por ID
router.get("/:id", verificarToken, (req, res) => {
  const user = usuarios.find((u) => u.id == req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ mensaje: "Usuario no encontrado" });
});

// Crear nuevo usuario
router.post("/", verificarToken, (req, res) => {
  const nuevo = req.body;
  nuevo.id = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
  usuarios.push(nuevo);
  res.status(201).json(nuevo);
});

// Actualizar usuario
router.put("/:id", verificarToken, (req, res) => {
  const index = usuarios.findIndex((u) => u.id == req.params.id);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...req.body };
    res.json(usuarios[index]);
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
});

// Eliminar usuario
router.delete("/:id", verificarToken, (req, res) => {
  const index = usuarios.findIndex((u) => u.id == req.params.id);
  if (index !== -1) {
    const eliminado = usuarios.splice(index, 1);
    res.json(eliminado[0]);
  } else {
    res.status(404).json({ mensaje: "Usuario no encontrado" });
  }
});

// Eliminar todos los usuarios
router.delete("/eliminar-todos", verificarToken, (req, res) => {
  usuarios = [];
  res.json({ mensaje: "Todos los usuarios han sido eliminados" });
});

// Agregar múltiples usuarios
router.post("/agregar-multiples", verificarToken, (req, res) => {
  const nuevosUsuarios = req.body;

  if (!Array.isArray(nuevosUsuarios)) {
    return res
      .status(400)
      .json({ mensaje: "Debe enviar un arreglo de usuarios" });
  }

  nuevosUsuarios.forEach((user) => {
    user.id = usuarios.length ? Math.max(...usuarios.map((u) => u.id)) + 1 : 1;
    usuarios.push(user);
  });

  res
    .status(201)
    .json({ mensaje: "Usuarios agregados", datos: nuevosUsuarios });
});

export default router;

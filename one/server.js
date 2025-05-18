import express from "express";
import dotenv from "dotenv";
import usersRouter from "./routes/users.js";

dotenv.config();

const app = express();

// Ruta de prueba para la raíz
app.get("/", (req, res) => {
  res.send("¡El servidor está funcionando correctamente!");
});

// Ruta de usuarios
app.use("/api/usuarios", usersRouter);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

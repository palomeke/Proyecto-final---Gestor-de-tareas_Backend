// Importar Express
import express from "express";
// Crear una instancia de la aplicación Express
const app = express();
// Ruta de prueba para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor funcionando ");
});

// Definir el puerto, usando una variable de entorno si está disponible
const PORT = process.env.PORT || 5000;
// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
require("dotenv").config();

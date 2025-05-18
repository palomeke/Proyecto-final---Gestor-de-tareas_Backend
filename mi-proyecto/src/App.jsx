import { useState, useEffect } from "react";
import Timer from "./Timer";
//Definición del Componente App
function App() {
  //Estructura de la Interfaz
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>MiTemporizador</h1>
      {/* Renderiza el componente Timer */}
      <Timer />
    </div>
  );
}
//Exportar el Componente App
export default App;

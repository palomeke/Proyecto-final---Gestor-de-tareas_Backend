import { useState, useEffect } from "react";
function Timer() {
  const [time, setTime] = useState(60); // Tiempo inicial en segundos
  const [isRunning, setIsRunning] = useState(false); // Estado de si el  temporizador está corriendo

  useEffect(() => {
    let interval;
    if (isRunning && time > 0) {
      // Solo iniciar el temporizador si está corriendo y el tiempo es mayor a 0
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      // Cuando el temporizador llega a 0, se detiene
      setIsRunning(false);
    }
    return () => clearInterval(interval); // Limpiar el intervalo cuando el componente se desmonte
  }, [isRunning, time]); // Se ejecuta cuando `isRunning` o `time` cambian

  const startTimer = () => {
    setIsRunning(true); // Inicia el temporizador
  };

  const pauseTimer = () => {
    setIsRunning(false); // Pausa el temporizador
  };

  const resetTimer = () => {
    setIsRunning(false); // Detiene el temporizador
    setTime(60); // Reinicia el tiempo a 60 segundos
  };
  return (
    <div>
      <h2>{time} segundos</h2>
      <button onClick={startTimer} disabled={isRunning}>
        Iniciar
      </button>
      <button onClick={pauseTimer} disabled={!isRunning}>
        Pausar
      </button>
      <button onClick={resetTimer}>Reiniciar</button>
    </div>
  );
}
export default Timer;

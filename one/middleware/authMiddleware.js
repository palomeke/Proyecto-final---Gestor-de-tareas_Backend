export function verificarToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token || token !== `Bearer ${process.env.SECRET_KEY}`) {
    return res.status(401).json({ mensaje: "Token inválido o faltante" });
  }
  next();
}

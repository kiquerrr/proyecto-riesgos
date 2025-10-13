const jwt = require("jsonwebtoken");

const SECRET = "riesgos-app-secret"; // cámbialo por una clave segura en producción

exports.login = (req, res) => {
  const { usuario, clave } = req.body;

  // Simulación de autenticación
  if (usuario === "admin" && clave === "admin123") {
    const token = jwt.sign({ nombre: usuario, rol: "admin" }, SECRET, { expiresIn: "2h" });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: "Credenciales inválidas" });
};

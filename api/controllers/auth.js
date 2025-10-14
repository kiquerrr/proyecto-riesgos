const jwt = require("jsonwebtoken");

// Usar variable de entorno en lugar de hardcodeado
const SECRET = process.env.JWT_SECRET || "riesgos-app-secret-default";

exports.login = (req, res) => {
  const { usuario, clave } = req.body;

  // Simulación de autenticación
  if (usuario === "admin" && clave === "admin123") {
    const token = jwt.sign(
      { nombre: usuario, rol: "admin" },
      SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "2h" }
    );
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: "Credenciales inválidas" });
};

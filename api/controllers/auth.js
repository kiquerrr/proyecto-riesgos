const jwt = require("jsonwebtoken");

const SECRET = "riesgos-app-secret"; // c�mbialo por una clave segura en producci�n

exports.login = (req, res) => {
  const { usuario, clave } = req.body;

  // Simulaci�n de autenticaci�n
  if (usuario === "admin" && clave === "admin123") {
    const token = jwt.sign({ nombre: usuario, rol: "admin" }, SECRET, { expiresIn: "2h" });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ error: "Credenciales inv�lidas" });
};

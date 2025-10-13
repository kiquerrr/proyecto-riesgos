module.exports = (req, res, next) => {
  const usuario = req.usuario; // Asume que ya fue autenticado

  if (!usuario || usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores.' });
  }

  next();
};

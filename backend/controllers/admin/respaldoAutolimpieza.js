const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const LOG_PATH = '/opt/riesgos-app/backend/logs/autolimpieza.log';
const SCRIPT_PATH = '/opt/riesgos-app/scripts/respaldo_autolimpieza.sh';

module.exports = async (req, res) => {
  // 🔐 Verifica rol admin
  const usuario = req.usuario; // Asumiendo que el middleware ya lo autenticó
  if (!usuario || usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores.' });
  }

  // ✅ Verifica confirmación explícita
  if (!req.body.confirmacion) {
    return res.status(400).json({ error: 'Confirmación requerida para ejecutar autolimpieza.' });
  }

  // 🧨 Ejecuta el script
  exec(`bash ${SCRIPT_PATH}`, async (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: 'Error al ejecutar el script.', detalle: stderr });
    }

    // 📖 Lee el log
    fs.readFile(LOG_PATH, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).json({ error: 'Error al leer el log.' });
      }

      // 📦 Extrae ruta del respaldo desde el log
      const match = data.match(/copiado a (\/opt\/riesgos-app\/backups\/riesgos_data_\d+\.dump)/);
      const rutaRespaldo = match ? match[1] : null;

      // 📋 Extrae últimas 5 líneas del log
      const lineas = data.trim().split('\n');
      const ultimas = lineas.slice(-5);

      // ✅ Respuesta final
      return res.json({
        respaldo: rutaRespaldo,
        resultado: 'Autolimpieza completada exitosamente después del respaldo.',
        log: ultimas
      });
    });
  });
};

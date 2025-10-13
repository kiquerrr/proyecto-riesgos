const pool = require('../db');

async function obtenerIdMoneda(codigo) {
  const resultado = await pool.query(
    'SELECT id FROM monedas WHERE codigo = $1',
    [codigo]
  );
  return resultado.rows[0]?.id || null;
}

module.exports = { obtenerIdMoneda };

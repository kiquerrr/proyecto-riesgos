const pool = require('../db');

async function registrarConsulta({ origen, destino, fuente, tipo, ip }) {
  await pool.query(`
    INSERT INTO logs (origen, destino, fuente, tipo, ip)
    VALUES ($1, $2, $3, $4, $5)
  `, [origen, destino, fuente, tipo, ip]);
}

module.exports = { registrarConsulta };

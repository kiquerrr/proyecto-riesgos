const express = require('express');
const router = express.Router();
const pool = require('../db');
const { obtenerIdMoneda } = require('../utils/monedas');
const { consultarBCV, consultarBinance } = require('../fuentes/index');
const { registrarConsulta } = require('../logs/registrar');

function esAntigua(fecha, minutos) {
  if (!minutos) return false;
  const ahora = new Date();
  const fechaTasa = new Date(fecha);
  const diferencia = (ahora - fechaTasa) / 1000 / 60;
  return diferencia > minutos;
}

router.get('/', async (req, res) => {
  const { origen, destino, minutos, fuente } = req.query;

  console.log('Consulta recibida:', { origen, destino, minutos, fuente });

  if (!origen || !destino) {
    console.log('Faltan parámetros');
    return res.status(400).json({ error: 'Faltan parámetros origen y destino' });
  }

  try {
    const idOrigen = await obtenerIdMoneda(origen);
    console.log('ID origen:', idOrigen);

    const idDestino = await obtenerIdMoneda(destino);
    console.log('ID destino:', idDestino);

    if (!idOrigen || !idDestino) {
      console.log('Código de moneda no válido');
      return res.status(404).json({ error: 'Código de moneda no válido' });
    }

    const resultado = await pool.query(`
      SELECT valor AS tasa, fecha_hora AS fecha, fuente_id AS fuente
      FROM tasas
      WHERE moneda_origen_id = $1 AND moneda_destino_id = $2
      ORDER BY fecha_hora DESC
      LIMIT 1
    `, [idOrigen, idDestino]);

    const tasaLocal = resultado.rows[0];
    console.log('Resultado local:', tasaLocal);

    let respuesta;
    let tipo;

    if (!tasaLocal || esAntigua(tasaLocal.fecha, minutos)) {
      tipo = 'externa';
      respuesta = fuente === 'BCV'
        ? await consultarBCV(origen, destino)
        : await consultarBinance(origen, destino);
    } else {
      tipo = 'local';
      respuesta = {
        origen,
        destino,
        ...tasaLocal
      };
    }

    console.log('Respuesta final:', respuesta);

    await registrarConsulta({
      origen,
      destino,
      fuente: respuesta.fuente,
      tipo,
      ip: req.ip
    });

    res.json(respuesta);
  } catch (error) {
    console.error('Error en /tasas:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;

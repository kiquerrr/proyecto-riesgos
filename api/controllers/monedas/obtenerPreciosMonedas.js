// Este controlador devuelve una respuesta simulada (mock)
// para confirmar que la ruta funciona correctamente,
// evitando el error 403 de la API Key en el entorno de prueba.

function obtenerPreciosMonedas(req, res) {
    console.log("[ADMIN] Ruta /data/precios/monedas verificada. Retornando data simulada.");

    // Respuesta JSON simulada que se usará en el frontend
    res.json({
        status: 'ok',
        data: "El Dólar (USD) está temporalmente simulado:\n1 USD = 0.95 EUR\n1 USD = 1.35 CAD\n1 USD = 150 JPY",
        sources: []
    });
}

module.exports = obtenerPreciosMonedas;

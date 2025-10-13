const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(process.cwd(), 'backend', 'logs', 'respaldo_autolimpieza_202510.log'); // Ruta del log (ajusta el nombre del mes si es necesario)
const MAX_LINES = 50; // Mostrar solo las últimas 50 líneas

function visualizarLogRespaldo(req, res) {
    console.log(`[ADMIN] Solicitud para leer el log: ${LOG_FILE}`);

    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('[ERROR] No se pudo leer el archivo de log:', err.message);
            // Devuelve un error 404 si el archivo no existe (log no generado aún)
            if (err.code === 'ENOENT') {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Archivo de log no encontrado. Verifique la ruta o si se han generado logs.',
                    filepath: LOG_FILE
                });
            }
            return res.status(500).json({ status: 'error', message: 'Error interno al leer el log.', details: err.message });
        }

        // Dividir por líneas, tomar las últimas N y unirlas de nuevo
        const lines = data.split('\n');
        const recentLines = lines.slice(-MAX_LINES).join('\n');

        res.json({
            status: 'ok',
            filename: path.basename(LOG_FILE),
            content: recentLines,
            totalLines: lines.length,
            displayedLines: recentLines.split('\n').length
        });
    });
}

module.exports = visualizarLogRespaldo;

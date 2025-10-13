const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const SCRIPT_PATH = '/opt/riesgos-app/scripts/diagnostico_respaldo.sh';
const AUDIT_LOG_PATH = '/opt/riesgos-app/backups/diagnostico_log.json'; 
const LOG_DIR = '/opt/riesgos-app/_diagnostico';

/**
 * Ejecuta el diagn�stico completo (respaldo, autolimpieza, validaci�n y logs).
 * @param {object} req - Objeto de solicitud de Express (debe contener req.usuario).
 * @param {object} res - Objeto de respuesta de Express.
 */
module.exports = async (req, res) => {
    const usuario = req.usuario;

    if (!usuario || usuario.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado: solo administradores.' });
    }

    // El controlador ejecuta el script Bash
    // CR�TICO: Tiempo de espera (timeout) reducido a 5000ms (5 segundos)
    exec(`bash ${SCRIPT_PATH}`, { timeout: 5000, maxBuffer: 1024 * 1024 * 2 }, (error, stdout, stderr) => {
        let resultadoEstructurado = null;
        
        // 1. INTENTAR BUSCAR EL BLOQUE ESTRUCTURADO EN STDOUT
        const match = stdout.match(/---RESULTADO_ESTRUCTURADO---([\s\S]*?)---------------------------/);
        
        if (match) {
            const block = match[1].trim();
            const data = {};
            
            block.split('\n').forEach(line => {
                const [key, value] = line.split(/:\s*/).map(s => s.trim());
                if (key && value) {
                    data[key.toLowerCase()] = value;
                }
            });

            // CR�TICO: Aseguramos que la conversi�n a n�mero no resulte en NaN.
            const parsedTablas = parseInt(data.respaldo_tablas, 10);

            // Reorganizar el JSON para que coincida con la especificación del proyecto
            resultadoEstructurado = {
                timestamp: new Date().toISOString(),
                usuario: usuario.nombre || usuario.uid,
                estructura: data.estructura,
                respaldo: {
                    archivo: data.respaldo_archivo,
                    tamano: data.respaldo_tamano,
                    fecha: data.respaldo_fecha_hora,
                    // Si el parseo es NaN, usamos 0.
                    tablas: isNaN(parsedTablas) ? 0 : parsedTablas, 
                    estado_validacion: data.validacion_estado
                },
                logs: data.logs_estado,
                estado: data.estado,
            };
        }

        // 2. Manejo de errores de ejecución (timeout, etc.)
        if (error || !resultadoEstructurado) {
            console.error("Error al ejecutar el script Bash:", error?.killed ? "Timeout (5s) o proceso terminado" : error || stderr);
            console.error("Salida de stdout (parcial):", stdout);

            const fallo = {
                timestamp: new Date().toISOString(),
                usuario: usuario.nombre || usuario.uid,
                estructura: 'ERROR',
                respaldo: { estado_validacion: 'ERROR_EJECUCION' },
                logs: 'ERROR',
                estado: 'fallido',
                error: error?.message || stderr || "Fallo sin salida estructurada. Ver logs Bash en " + LOG_DIR
            };
            
            // Escribe el fallo en formato NDJSON
            fs.writeFile(AUDIT_LOG_PATH, JSON.stringify(fallo, null, 2) + "\n", { flag: 'a' }, () => {}); 

            // Devolver respuesta 500
            return res.status(500).json(fallo);
        }

        // 3. Ejecución exitosa: Escribir el log de auditor�a
        const logData = JSON.stringify(resultadoEstructurado, null, 2) + "\n";
        
        fs.writeFile(AUDIT_LOG_PATH, logData, { flag: 'a' }, (err) => {
            if (err) {
                console.error("Error al escribir el log de auditor�a:", err);
            }
        });

        // 4. Devolver respuesta exitosa (200)
        return res.status(200).json(resultadoEstructurado);
    });
};
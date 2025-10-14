const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process'); // Necesario para reiniciar DB

// Middleware de autenticación
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token === 'TU_TOKEN_DE_PRUEBA_AQUI') {
            return next();
        }
    }
    return res.status(401).json({ error: 'Acceso denegado. Token no válido o expirado.' });
};

// =========================================================================
// RUTAS DE DATOS PUBLICOS (NO PROTEGIDAS)
// =========================================================================

// La ruta de Monedas que el frontend busca: /admin/data/precios/monedas
router.get('/data/precios/monedas', (req, res) => {
    const mockData = {
        status: 'OK',
        USD: {
            precio: '985.50',
            variacion: '+0.15'
        },
        EUR: {
            precio: '1050.25',
            variacion: '-0.05'
        }
    };
    res.json(mockData);
});

// Ruta de prueba que el frontend busca: /admin/health
router.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// =========================================================================
// RUTAS PROTEGIDAS (Requieren Token de Administrador)
// =========================================================================

// Ruta de Logs de Respaldo que el frontend busca: /admin/data/respaldo/logs
router.get('/data/respaldo/logs', authenticateAdmin, (req, res) => {
    // Aquí se leerían los logs reales
    res.json({ 
        logs: 'Acceso correcto. Los logs se mostrarian aqui.',
        message: 'Acceso correcto a Logs. Se requiere implementacion de lectura de archivo.'
    });
});

// Ruta de Reinicio de Base de Datos que el frontend busca: /admin/saneamiento/restart-db
router.post('/saneamiento/restart-db', authenticateAdmin, (req, res) => {
    // Ejecucion simulada del comando de reinicio
    exec('echo "Simulando reinicio de riesgos-db..."', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: 'Fallo al ejecutar el comando de reinicio simulado.' });
        }
        res.json({ message: 'Comando de reinicio de DB simulado exitosamente.' });
    });
});

// Ruta protegida: Obtener auditorías desde diagnostico_log.json
router.get('/logs/auditorias', authenticateAdmin, (req, res) => {
    // CORRECCION CRITICA DE RUTA: path.join(__dirname, '..', '..', '_diagnostico', 'diagnostico_log.json');
    // __dirname es /opt/riesgos-app/api/routes. 
    // Subir dos niveles (../../) nos lleva a /opt/riesgos-app, donde está _diagnostico.
    const logPath = path.join(__dirname, '..', '..', '_diagnostico', 'diagnostico_log.json');

    try {
        const rawData = fs.readFileSync(logPath, 'utf8');
        const auditorias = JSON.parse(rawData);
        if (!Array.isArray(auditorias)) {
            return res.status(500).json({ error: 'Formato inválido en diagnostico_log.json' });
        }
        res.json(auditorias);
    } catch (error) {
        console.error('Error al leer auditorías:', error.message);
        res.status(500).json({ error: 'No se pudo cargar el historial de auditorías' });
    }
});

// Otras rutas existentes
router.get('/status', authenticateAdmin, (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        message: 'Sistema operativo'
    });
});

router.get('/logs', authenticateAdmin, (req, res) => {
    res.json({
        logs: [],
        message: 'No hay logs disponibles'
    });
});

module.exports = router;

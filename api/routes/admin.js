const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

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

// Ruta protegida: Obtener estado del sistema
router.get('/status', authenticateAdmin, (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date(),
        message: 'Sistema operativo'
    });
});

// Ruta protegida: Obtener logs
router.get('/logs', authenticateAdmin, (req, res) => {
    res.json({
        logs: [],
        message: 'No hay logs disponibles'
    });
});

// Ruta protegida: Obtener auditorías desde diagnostico_log.json
router.get('/logs/auditorias', authenticateAdmin, (req, res) => {
    const logPath = path.join(__dirname, '../../_diagnostico/diagnostico_log.json');

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

// Ruta de saludo (sin protección)
router.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

module.exports = router;

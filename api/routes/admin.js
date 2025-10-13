const express = require('express');
const router = express.Router();

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

// Ruta de saludo (sin protección)
router.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

module.exports = router;

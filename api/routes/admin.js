cat > api/routes/admin.js << EOF
const express = require('express');
const router = express.Router();

// Middleware de autenticacion (simulado)
const authenticateAdmin = (req, res, next) => {
    // Simular verificacion de token. Esperamos 'Bearer TU_TOKEN_DE_PRUEBA_AQUI'
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        if (token === 'TU_TOKEN_DE_PRUEBA_AQUI') {
            return next(); // Token valido
        }
    }
    // Si el token no es valido o no esta presente
    return res.status(401).json({ error: 'Acceso denegado. Token no valido o expirado.' });
};

// --- RUTAS PROTEGIDAS (Requieren authenticateAdmin) ---

// 1. Ruta para Forzar Reinicio DB
router.post('/saneamiento/db/restart', authenticateAdmin, (req, res) => {
    // Simulacion de reinicio de BD
    console.log('[ADMIN] Solicitud de reinicio de BD recibida.');
    // Usamos setTimeout para simular la latencia y asegurar que el frontend vea el estado 'Cargando...'
    setTimeout(() => {
        res.json({ 
            status: 'OK', 
            message: 'Comando de reinicio de Base de Datos ejecutado exitosamente. Verifique el estado del contenedor.' 
        });
    }, 1500); 
});

// 2. Ruta para Visualizar Logs de Respaldo
router.get('/logs/respaldo', authenticateAdmin, (req, res) => {
    // Datos de log simulados
    const logs = [
        '[2025-10-15 08:00:00] INFO: Inicio de respaldo diario.',
        '[2025-10-15 08:00:15] DEBUG: Conectando a riesgos-db.',
        '[2025-10-15 08:01:30] SUCCESS: 1.2 GB de datos respaldados con exito.',
        '[2025-10-15 08:01:45] INFO: Fin del proceso de respaldo.',
        '[2025-10-14 10:15:22] WARN: Espacio en disco bajo (85%).'
    ].join('\n');
    
    res.json({ 
        status: 'OK', 
        logs: logs 
    });
});

// --- RUTAS NO PROTEGIDAS ---

// 3. Ruta para Obtener Precios de Monedas (Mock Data)
router.get('/data/precios/monedas', (req, res) => {
    // Datos de moneda simulados con la estructura esperada por el frontend
    const mockData = {
        status: 'Simulado para pruebas',
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

module.exports = router;
EOF
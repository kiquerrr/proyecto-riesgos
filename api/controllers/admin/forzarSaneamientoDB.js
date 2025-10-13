const { exec } = require('child_process');

// Nombre del contenedor Docker de la base de datos a reiniciar
const DB_CONTAINER_NAME = 'riesgos-db'; 

function forzarSaneamientoDB(req, res) {
    console.log(`[ADMIN] Solicitud para reiniciar el contenedor: ${DB_CONTAINER_NAME}`);

    // Comando para reiniciar el contenedor Docker
    const comandoRestart = `docker restart ${DB_CONTAINER_NAME}`;

    exec(comandoRestart, (error, stdout, stderr) => {
        if (error) {
            console.error(`[ERROR] Fallo al reiniciar el contenedor ${DB_CONTAINER_NAME}: ${error.message}`);
            return res.status(500).json({ 
                status: 'error', 
                message: 'No se pudo reiniciar el contenedor de la DB.',
                details: stderr || error.message
            });
        }
        
        console.log(`[ÉXITO] Contenedor ${DB_CONTAINER_NAME} reiniciado exitosamente. ${stdout}`);
        res.json({ 
            status: 'ok', 
            message: `Contenedor ${DB_CONTAINER_NAME} reiniciado con éxito.` 
        });
    });
}

module.exports = forzarSaneamientoDB;

const authController = require('../api/controllers/auth');
const diagnosticoController = require('../api/controllers/admin/diagnosticoRespaldo');
const fs = require('fs');
const jwt = require('jsonwebtoken'); // Usar jwt directamente aqu�
const SECRET = "riesgos-app-secret";

// --- 1. Utilidades de Mocking (Node.js Puro) ---

const mockResponse = () => {
    const res = {
        statusValue: 200, 
        jsonValue: null
    };
    res.status = (code) => {
        res.statusValue = code;
        return res; 
    };
    res.json = (data) => {
        res.jsonValue = data;
        return res;
    };
    return res;
};

// --- 2. Obtener Token de Admin ---
let adminToken = '';
const reqLogin = { body: { usuario: "admin", clave: "admin123" } };
const resLogin = mockResponse();
authController.login(reqLogin, resLogin);

if (resLogin.statusValue === 200) {
    
    // El payload debe coincidir con el que inyecta el middleware
    const payload = jwt.verify(resLogin.jsonValue.token, SECRET); 

    // --- 3. Ejecutar el Controlador de Diagn�stico ---
    console.log("=========================================");
    console.log("?? PRUEBA FINAL: Integraci�n de Diagn�stico y Auditor�a");
    console.log("=========================================");

    // Se simula la solicitud con el usuario inyectado por el middleware
    const reqAdmin = { 
        usuario: payload 
    };
    const resAdmin = mockResponse();

    // Se limpia el archivo de log de auditor�a antes de la prueba para una verificaci�n limpia
    const logPath = "/opt/riesgos-app/backups/diagnostico_log.json";
    if (fs.existsSync(logPath)) {
        fs.unlinkSync(logPath);
        console.log("~ Limpiando log de auditor�a anterior...");
    }

    diagnosticoController(reqAdmin, resAdmin);
    
    // AUMENTADO EL TIMEOUT a 15000ms para asegurar que el script termine
    setTimeout(() => {
        const resultado = resAdmin.jsonValue;
        
        if (resAdmin.statusValue === 200 && resultado && resultado.estado === 'completo') {
            
            // Criterios de Validaci�n (Capa de Auditor�a y Robustez)
            const tablas = resultado.respaldo.tablas;
            const usuario = resultado.usuario;
            
            console.log(`? �XITO: Status 200 y Diagn�stico Completo.`);
            console.log(`- Usuario registrado (Trazabilidad): ${usuario}`);
            console.log(`- Tablas contadas (Validaci�n de Integridad): ${tablas}`);
            console.log(`- Estado de Respaldo: ${resultado.respaldo.estado_validacion}`);
            
            // Verifica que el log de auditor�a se haya escrito
            try {
                const logContent = fs.readFileSync(logPath, 'utf-8');
                const logEntry = JSON.parse(logContent.trim());
                console.log(`- Registro de Auditor�a escrito: ? OK`);
                
                if (tablas > 4 && usuario === 'admin' && logEntry.estado === 'completo') {
                    console.log("\n=========================================");
                    console.log("? RESULTADO FINAL: El sistema de Auditor�a, Trazabilidad y Robustez es funcional.");
                    console.log("=========================================");
                } else {
                    console.log("? FALLO L�GICO: Los datos parseados no cumplen con las expectativas.");
                }
            } catch (err) {
                console.log("? FALLO DE AUDITOR�A: No se pudo leer o parsear el log de auditor�a.");
                console.log(err.message);
            }
        } else {
            console.log(`? FALLO: El controlador regres� status ${resAdmin.statusValue} o fall� la ejecuci�n.`);
            console.log("Error:", resultado?.error || 'No se recibi� respuesta a tiempo.');
        }
    }, 15000); 
} else {
    console.log("Error: No se pudo generar el token de admin para iniciar la prueba de integraci�n.");
}
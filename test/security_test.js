// Carga de M�dulos (Aseg�rate de que las rutas sean correctas)
const authController = require('../api/controllers/auth');
const verificarAdminMiddleware = require('../api/middleware/verificarAdmin');

// --- 1. Utilidades para Simulaci�n (Node.js Puro) ---

/**
 * Simula el objeto de respuesta de Express (res).
 * Captura el estado y los datos JSON para verificaci�n.
 */
const mockResponse = () => {
    const res = {
        statusValue: 200, // Valor predeterminado
        jsonValue: null
    };

    res.status = (code) => {
        res.statusValue = code;
        return res; // Devuelve 'res' para encadenar: res.status(200).json(...)
    };

    res.json = (data) => {
        res.jsonValue = data;
        return res;
    };

    return res;
};

// --- 2. Pruebas de Autenticaci�n (auth.js) ---

console.log("=========================================");
console.log("?? PRUEBA 1: Autenticaci�n Exitosa (ADMIN)");
console.log("=========================================");

const reqLoginSuccess = { body: { usuario: "admin", clave: "admin123" } };
const resLoginSuccess = mockResponse();

authController.login(reqLoginSuccess, resLoginSuccess);

let adminToken = null;
if (resLoginSuccess.statusValue === 200) {
    adminToken = resLoginSuccess.jsonValue.token;
    console.log(`? Resultado: 200 OK. Token generado:\n${adminToken.substring(0, 40)}...`);
} else {
    console.log("? FALLO: No se pudo generar el token de admin. Status:", resLoginSuccess.statusValue);
}

console.log("\n=========================================");
console.log("?? PRUEBA 2: Autenticaci�n Fallida");
console.log("=========================================");

const reqLoginFail = { body: { usuario: "admin", clave: "clave_mala" } };
const resLoginFail = mockResponse();

authController.login(reqLoginFail, resLoginFail);

if (resLoginFail.statusValue === 401) {
    console.log(`? Resultado: 401 Unauthorized. Error: ${resLoginFail.jsonValue.error}`);
} else {
    console.log("? FALLO: Deber�a haber denegado el acceso con 401. Status:", resLoginFail.statusValue);
}

// --- 3. Pruebas de Middleware (verificarAdmin.js) ---

if (adminToken) {
    console.log("\n=========================================");
    console.log("?? PRUEBA 3: Middleware Acceso Exitoso (Admin)");
    console.log("=========================================");

    const reqAdminAccess = { headers: { authorization: `Bearer ${adminToken}` } };
    const resAdminAccess = mockResponse();
    let nextCalled = false;

    verificarAdminMiddleware(reqAdminAccess, resAdminAccess, () => {
        nextCalled = true; // El middleware llama a next() si el acceso es OK
    });

    if (nextCalled && reqAdminAccess.usuario && reqAdminAccess.usuario.rol === 'admin') {
        console.log(`? Resultado: Acceso concedido (next() llamado).`);
        console.log(`Usuario inyectado en req.usuario: ${reqAdminAccess.usuario.nombre} (${reqAdminAccess.usuario.rol})`);
    } else {
        console.log("? FALLO: Acceso denegado o usuario no inyectado.");
    }
}

console.log("\n=========================================");
console.log("?? PRUEBA 4: Middleware Acceso Denegado (Token Inexistente)");
console.log("=========================================");

const reqNoToken = { headers: {} };
const resNoToken = mockResponse();

verificarAdminMiddleware(reqNoToken, resNoToken, () => {});

if (resNoToken.statusValue === 401) {
    console.log(`? Resultado: 401 Unauthorized. Error: ${resNoToken.jsonValue.error}`);
} else {
    console.log("? FALLO: No se detect� la falta de token con 401. Status:", resNoToken.statusValue);
}

console.log("\n=========================================");
console.log("?? PRUEBA 5: Middleware Acceso Denegado (Token Alterado/Inv�lido)");
console.log("=========================================");

// Simular un token alterado (solo se cambia la �ltima letra, invalidando la firma)
const alteredToken = adminToken ? `${adminToken.slice(0, -1)}Z` : 'Invalid.Token.Here';
const reqInvalidToken = { headers: { authorization: `Bearer ${alteredToken}` } };
const resInvalidToken = mockResponse();

verificarAdminMiddleware(reqInvalidToken, resInvalidToken, () => {});

if (resInvalidToken.statusValue === 403) {
    console.log(`? Resultado: 403 Forbidden. Error: ${resInvalidToken.jsonValue.error}`);
} else {
    console.log("? FALLO: No se deneg� el token inv�lido con 403. Status:", resInvalidToken.statusValue);
}
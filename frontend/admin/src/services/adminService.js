// Configuracion de las peticiones HTTP para el Dashboard de Administrador
// La IP '10.68.222.26' se asume como la direccion de la API en la red local/Docker.
// IMPORTANTE: Si la API esta en la misma maquina, se recomienda usar 'http://localhost:3000/admin'
// para evitar problemas de red.
const API_URL = 'http://10.68.222.26:3000/admin'; 

/**
 * Obtener precios de monedas (mock)
 * No requiere autenticación
 */
export const getMonedasPreciosOptions = () => ({
  url: `${API_URL}/data/precios/monedas`,
  options: {
    method: 'GET'
  }
});

/**
 * Obtener logs de respaldo y limpieza
 * Requiere token de administrador
 * RUTA CORREGIDA para coincidir con el backend: /data/respaldo/logs
 */
export const getRespaldoLogsOptions = (token) => ({
  url: `${API_URL}/data/respaldo/logs`,
  options: {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
});

/**
 * Reiniciar forzadamente la base de datos
 * Requiere token de administrador
 * RUTA CORREGIDA para coincidir con el backend: /saneamiento/restart-db
 */
export const restartDBOptions = (token) => ({
  url: `${API_URL}/saneamiento/restart-db`,
  options: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
});

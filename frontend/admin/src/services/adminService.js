// ? Dirección IP del backend en red local
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
 */
export const getRespaldoLogsOptions = (token) => ({
  url: `${API_URL}/logs/respaldo`,
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
 */
export const restartDBOptions = (token) => ({
  url: `${API_URL}/saneamiento/db/restart`,
  options: {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
});

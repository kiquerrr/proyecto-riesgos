// Configuración de las peticiones HTTP para el Dashboard de Administrador
// Usa localhost:3000 ya que frontend y backend corren en la misma máquina
const API_URL = 'http://localhost:3000/admin';

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

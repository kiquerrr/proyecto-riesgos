// auditoriaService.js – Servicio para obtener auditorías desde el backend
// Este módulo centraliza la lógica de fetch para el componente AuditoriaCard

const getAuditorias = async () => {
  try {
    const response = await fetch('/admin/logs/auditorias', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener auditorías');
    }

    const data = await response.json();

    // Validar que el formato sea el esperado
    if (!Array.isArray(data)) {
      throw new Error('Formato de auditoría inválido');
    }

    return data;
  } catch (error) {
    console.error('auditoriaService error:', error.message);
    throw error;
  }
};

export default {
  getAuditorias,
};

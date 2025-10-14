// auditoriaService.js � Servicio para obtener auditor�as desde el backend
// Este m�dulo centraliza la l�gica de fetch para el componente AuditoriaCard

const getAuditorias = async () => {
  try {
    const response = await fetch('/admin/logs/auditorias', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener auditor�as');
    }

    const data = await response.json();

    // Validar que el formato sea el esperado
    if (!Array.isArray(data)) {
      throw new Error('Formato de auditor�a inv�lido');
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

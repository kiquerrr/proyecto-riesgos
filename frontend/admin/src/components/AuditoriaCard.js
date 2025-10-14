// AuditoriaCard.js � Componente para visualizar auditor�as registradas
// Este componente lee los datos de diagn�stico y los presenta en tarjetas ordenadas.

import React from 'react';

// Recibe una lista de auditor�as como prop
const AuditoriaCard = ({ auditorias }) => {
  return (
    <div>
      <h2>Historial de Auditor�as</h2>
      {auditorias.length === 0 ? (
        <p>No hay auditor�as registradas.</p>
      ) : (
        auditorias.map((auditoria, index) => (
          <div key={index} style={styles.card}>
            <p><strong>Fecha:</strong> {auditoria.fecha}</p>
            <p><strong>Tablas verificadas:</strong> {auditoria.tablas_verificadas}</p>
            <p><strong>Resultado:</strong> {auditoria.resultado}</p>
            <p><strong>Observaciones:</strong> {auditoria.observaciones}</p>
          </div>
        ))
      )}
    </div>
  );
};

// Estilos b�sicos para la tarjeta
const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9',
  },
};

export default AuditoriaCard;

import React, { useState, useEffect } from 'react';
import { getRespaldoLogs } from '../services/adminService';

const LogsViewer = () => {
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // En una aplicaci\u00f3n real, se deber\u00eda recargar el componente o llamar aqu\u00ed
        // para tener el log actualizado
        getRespaldoLogs()
            .then(res => {
                setLogs(`Archivo: ${res.filename} (Mostrando ${res.displayedLines} de ${res.totalLines} líneas)\n\n${res.content}`);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="card">Cargando logs de respaldo...</div>;

    return (
        <div className="card logs-viewer">
            <h3>📑 Logs de Respaldo y Limpieza (Últimas 50 líneas)</h3>
            
            {error ? (
                <div style={{ color: 'red', padding: '10px', border: '1px solid red' }}>
                    ❌ Error de carga/Acceso: {error}
                    <p style={{marginTop: '5px', fontSize: '0.9em'}}>Recuerde que esta operaci\u00f3n requiere un Token de Administrador v\u00e1lido.</p>
                </div>
            ) : (
                <textarea
                    readOnly
                    value={logs}
                    rows={15}
                    style={{ width: '100%', backgroundColor: '#333', color: '#0f0', border: 'none', padding: '10px', fontFamily: 'monospace' }}
                />
            )}
        </div>
    );
};

export default LogsViewer;

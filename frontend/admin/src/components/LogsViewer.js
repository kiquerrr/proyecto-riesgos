import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';

const LogsViewer = () => {
    const [logs, setLogs] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const TOKEN_TEST = 'TU_TOKEN_DE_PRUEBA_AQUI';
        const { url, options } = adminService.getRespaldoLogsOptions(TOKEN_TEST);
        
        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                setLogs(data.logs || JSON.stringify(data, null, 2));
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
                    <p style={{marginTop: '5px', fontSize: '0.9em'}}>Recuerde que esta operación requiere un Token de Administrador válido.</p>
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

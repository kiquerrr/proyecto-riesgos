import React from 'react';

const LogCard = ({ logs, logError }) => {
    return (
        <div className="card bg-white p-6 rounded-lg shadow-xl mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="text-blue-500 mr-2">\uD83D\uDCCB</span> Logs de Respaldo y Limpieza (Ultimas 50 lineas)
            </h2>
            
            {logError ? (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-700">
                    <span className="font-bold">\u274C Error de carga/Acceso:</span> {logError}
                    <p className="mt-1 text-sm">Recuerde que esta operacion requiere un Token de Administrador valido.</p>
                </div>
            ) : (
                <div className="h-64 overflow-y-scroll bg-gray-50 p-3 rounded-lg text-sm font-mono text-gray-700 border border-gray-200">
                    {logs.split('\n').map((line, index) => (
                        <p key={index} className="whitespace-pre-wrap">{line}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LogCard;

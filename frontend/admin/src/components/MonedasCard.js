import React from 'react';

const MonedasCard = ({ monedas, monedasError }) => {
    // 1. Determinar si hay datos. Si monedas es un objeto y tiene USD, hay datos.
    const hasMonedasData = monedas && typeof monedas === 'object' && monedas.USD;
    
    return (
        <div className="card bg-white p-6 rounded-lg shadow-xl mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="text-green-500 mr-2">\uD83D\uDCB5</span> Tasas de Cambio (Mock Data)
            </h2>
            
            {monedasError ? (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-700">
                    <span className="font-bold">\u274C Error:</span> {monedasError}
                </div>
            ) : hasMonedasData ? (
                // 2. Renderizar solo si hasMonedasData es verdadero
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-green-700">
                    <p className="font-semibold">USD (Dolar): \${monedas.USD.precio} - \${monedas.USD.variacion}%</p>
                    <p className="font-semibold">EUR (Euro): \u20AC{monedas.EUR.precio} - \${monedas.EUR.variacion}%</p>
                    <p className="mt-2 text-sm">
                        Estado: {monedas.status}. El Dolar (USD) esta temporalmente simulado para fines de prueba.
                    </p>
                </div>
            ) : (
                // 3. Mostrar el estado de carga solo si no hay error
                <p className="text-gray-500">Cargando datos de monedas...</p>
            )}
        </div>
    );
};

export default MonedasCard;

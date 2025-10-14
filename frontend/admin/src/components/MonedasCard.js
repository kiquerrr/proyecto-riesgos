import React from 'react';

const MonedasCard = ({ monedas, monedasError }) => {
    // El backend retorna: { status: 'ok', data: "...", sources: [] }
    const hasData = monedas && monedas.status === 'ok';

    return (
        <div className="card bg-white p-6 rounded-lg shadow-xl mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="text-green-500 mr-2">💵</span> Tasas de Cambio
            </h2>

            {monedasError ? (
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-red-700">
                    <span className="font-bold">❌ Error:</span> {monedasError}
                </div>
            ) : hasData ? (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-green-700">
                    <p className="font-semibold whitespace-pre-wrap">{monedas.data}</p>
                    <p className="mt-2 text-sm">
                        Estado: {monedas.status}. Los datos están siendo consultados desde múltiples fuentes.
                    </p>
                </div>
            ) : (
                <p className="text-gray-500">Cargando datos de monedas...</p>
            )}
        </div>
    );
};

export default MonedasCard;

import React from 'react';

const SaneamientoCard = ({ onRestartDB, restartError }) => {
    return (
        <div className="card bg-white p-6 rounded-lg shadow-xl mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                <span className="text-yellow-500 mr-2">\u2699\ufe0f</span> Control de Resiliencia
            </h2>
            <p className="text-gray-600 mb-4">
                Reinicia forzadamente el contenedor de la Base de Datos 'riesgos-db'. Util para recuperar la conexion.
            </p>
            
            <button
                onClick={onRestartDB}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
            >
                Forzar Reinicio DB
            </button>

            {restartError && (
                <p className="text-red-500 mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <span className="font-bold">Error:</span> {restartError}
                </p>
            )}
        </div>
    );
};

export default SaneamientoCard;

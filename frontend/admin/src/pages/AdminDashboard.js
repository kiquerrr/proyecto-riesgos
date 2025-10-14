import React, { useState, useEffect } from 'react';
import * as adminService from '../services/adminService';
import SaneamientoCard from '../components/SaneamientoCard';
import LogCard from '../components/LogCard';
import MonedasCard from '../components/MonedasCard';

const TOKEN_TEST = 'TU_TOKEN_DE_PRUEBA_AQUI';

// Funcion de fetch segura que maneja la conexion, errores y parseo de datos.
const safeFetch = async (url, options) => {
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            // 1. Manejar errores de autenticacion (401/403)
            if (response.status === 401 || response.status === 403) {
                throw new Error("Acceso denegado. Token no valido o expirado.");
            }
            
            // 2. Intentar leer el cuerpo del error (siempre deberia ser JSON)
            try {
                const errorBody = await response.json();
                throw new Error("Error en la peticion (" + response.status + "): " + (errorBody.error || response.statusText));
            } catch (e) {
                // Falla al leer JSON 
                throw new Error("Error en la peticion: " + response.statusText);
            }
        }

        // 3. Si la respuesta es OK (200), intentar retornar JSON.
        // Si falla (como la ruta de logs), retornamos como texto. Esto resuelve el problema de parseo.
        try {
            return await response.json();
        } catch (e) {
            return await response.text(); 
        }

    } catch (error) {
        // Error de red (Failed to fetch) o error lanzado en los bloques anteriores
        throw new Error(error.message);
    }
};

const AdminDashboard = () => {
    // Estado para logs. Inicializado con mensaje.
    const [logs, setLogs] = useState('Cargando logs...');
    const [logError, setLogError] = useState(null);

    // Estado para monedas. Inicializado en null.
    const [monedas, setMonedas] = useState(null);
    const [monedasError, setMonedasError] = useState(null);

    // Estado para reinicio DB
    const [restartError, setRestartError] = useState(null);
    const [restartMessage, setRestartMessage] = useState(null);

    // Cargar Logs y Monedas al inicio (useEffect se ejecuta una sola vez al montar el componente)
    useEffect(() => {
        // FETCH 1: Monedas (Ruta NO protegida)
        const { url: monedasUrl, options: monedasOptions } = adminService.getMonedasPreciosOptions();
        safeFetch(monedasUrl, monedasOptions)
            .then(data => setMonedas(data))
            .catch(error => setMonedasError("Error al cargar monedas: " + error.message));

        // FETCH 2: Logs (Ruta protegida por token)
        const { url: logsUrl, options: logsOptions } = adminService.getRespaldoLogsOptions(TOKEN_TEST);
        safeFetch(logsUrl, logsOptions)
            .then(data => setLogs(data.logs || data)) // data.logs para JSON, data para texto plano
            .catch(error => setLogError("Error de carga/Acceso: " + error.message));
    }, []);

    // Manejador para el Reinicio de DB (Ruta protegida)
    const handleRestartDB = () => {
        setRestartError(null);
        setRestartMessage('Iniciando proceso de reinicio...');
        
        const { url: restartUrl, options: restartOptions } = adminService.restartDBOptions(TOKEN_TEST);
        safeFetch(restartUrl, restartOptions)
            .then(response => {
                setRestartMessage(response.message || 'Base de Datos reiniciada exitosamente.');
            })
            .catch(error => {
                setRestartError(error.message);
                setRestartMessage(null);
            });
    };

    return (
        <div className="p-4 sm:p-8">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
                Panel de Administrador (Riesgos App)
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. Tarjeta de Saneamiento/Reinicio DB */}
                <SaneamientoCard 
                    onRestartDB={handleRestartDB} 
                    restartError={restartError || restartMessage} 
                />

                {/* 2. Tarjeta de Monedas */}
                <MonedasCard 
                    monedas={monedas} 
                    monedasError={monedasError} 
                />
                
                {/* 3. Tarjeta de Logs */}
                <LogCard 
                    logs={logs} 
                    logError={logError} 
                />
            </div>

            <p className="mt-8 text-sm text-gray-500">
                Nota: Esta operacion requiere un Token de Administrador valido para las rutas de /saneamiento y /logs.
            </p>
        </div>
    );
};

export default AdminDashboard;

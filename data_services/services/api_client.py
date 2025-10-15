# -*- coding: utf-8 -*-
import requests
import json
from datetime import datetime

# --- CONSTANTE DE URL (ENDPOINT ESPECIFICO PARA VENEZUELA) ---
URL_TASAS_VE = "https://criptoya.com/api/ve"

def obtener_tasas_actuales():
    """
    Consulta la API de CriptoYa usando el endpoint especifico para Venezuela.
    """
    tasas = {}
    try:
        response = requests.get(URL_TASAS_VE, timeout=15)

        if response.status_code == 200:
            data = response.json()
            
            # --- CLAVES CORRECTAS PARA VENEZUELA ---
            # Extraemos los precios usando las claves correctas de este endpoint.
            bcv_data = data.get('bcv', {})
            paralelo_data = data.get('enparalelovzla', {})
            usdt_data = data.get('binance', {})
            
            # Navegamos de forma segura para obtener los precios.
            bcv_price = bcv_data.get('price', 0)
            paralelo_price = paralelo_data.get('price', 0)
            usdt_price = usdt_data.get('price', 0)

            # La fecha de actualizacion viene en cada objeto. Usaremos la del BCV como referencia.
            fecha_actualizacion = bcv_data.get('last_update', "No disponible")

            tasas['bcv'] = {'precio': bcv_price, 'ultima_actualizacion': fecha_actualizacion}
            tasas['paralelo'] = {'precio': paralelo_price, 'ultima_actualizacion': paralelo_data.get('last_update', fecha_actualizacion)}
            tasas['usdt'] = {'precio': usdt_price, 'ultima_actualizacion': usdt_data.get('last_update', fecha_actualizacion)}
        else:
            return {'error_general': f'La API respondio con un error. Codigo: {response.status_code}'}

    except requests.exceptions.RequestException as e:
        return {'error_general': f'Fallo de conexion: {e}'}

    tasas['timestamp_consulta'] = datetime.now().isoformat()
    return tasas

# --- Bloque de Prueba ---
if __name__ == "__main__":
    print(">> Iniciando prueba de consulta de tasas (v15 - Venezuela Endpoint)...")
    tasas_obtenidas = obtener_tasas_actuales()
    print("\n>> Resultados obtenidos:")
    print(json.dumps(tasas_obtenidas, indent=4, ensure_ascii=False))
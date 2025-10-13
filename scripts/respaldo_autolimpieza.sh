#!/bin/bash

# Este script realiza un respaldo de la base de datos y ejecuta la autolimpieza de dumps antiguos.

# --- Configuración (CRÍTICO: No tocar) ---
BACKUPS_DIR="/opt/riesgos-app/backups"
LOG_FILE="/opt/riesgos-app/backend/logs/respaldo_autolimpieza_$(date +%Y%m).log"
CONTAINER="riesgos-db"
DB_USER="riesgos_user"
DB_NAME="riesgos_data"
DB_PASS="riesgos_pass" # Clave del usuario de riesgo
DIAS_RETENCION=30

# Asegurar que el directorio de logs existe
mkdir -p /opt/riesgos-app/backend/logs
echo "=========================================" >> "$LOG_FILE"
echo "INICIO DEL PROCESO: $(date)" >> "$LOG_FILE"

# --- Funciones de Autosaneamiento ---

# Función para verificar el estado de la DB y reiniciarla si es necesario
verificar_y_sanear_db() {
    echo "?? Verificando estado de la DB en el contenedor..." >> "$LOG_FILE"

    # Usamos pg_isready dentro del contenedor para verificar la conexión
    # -t 1: timeout de 1 segundo
    docker exec -e PGPASSWORD="$DB_PASS" "$CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" -t 1

    if [ $? -ne 0 ]; then
        echo "?? FALLO DE CONEXIÓN: La base de datos no está lista. Intentando reiniciar el contenedor..." >> "$LOG_FILE"
        
        # Intenta reiniciar el contenedor
        docker restart "$CONTAINER" >> "$LOG_FILE" 2>&1
        
        # Espera 5 segundos para que PostgreSQL inicie
        sleep 5
        
        # Vuelve a verificar el estado
        docker exec -e PGPASSWORD="$DB_PASS" "$CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" -t 5
        
        if [ $? -eq 0 ]; then
            echo "? CONTENEDOR REINICIADO Y BASE DE DATOS RECUPERADA." >> "$LOG_FILE"
            return 0 # Éxito en el saneamiento
        else
            echo "? FALLO CRÍTICO: El reinicio no solucionó el problema. ABORTANDO RESPALDO." >> "$LOG_FILE"
            return 1 # Fallo crítico
        fi
    else
        echo "? Base de datos lista para el respaldo." >> "$LOG_FILE"
        return 0 # Éxito sin necesidad de saneamiento
    fi
}

# --- Funciones de Respaldo ---

ejecutar_respaldo() {
    local TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    local DUMP_FILE="/tmp/riesgos_data_$TIMESTAMP.dump"
    
    echo "?? Ejecutando pg_dump..." >> "$LOG_FILE"

    # Ejecuta pg_dump DENTRO del contenedor Docker
    docker exec -e PGPASSWORD="$DB_PASS" "$CONTAINER" pg_dump -Fc -U "$DB_USER" -d "$DB_NAME" -f "$DUMP_FILE"

    if [ $? -eq 0 ]; then
        echo "? Respaldo de $DB_NAME completado con éxito." >> "$LOG_FILE"
        
        # Copia el dump del contenedor al host
        docker cp "$CONTAINER:$DUMP_FILE" "$BACKUPS_DIR/"
        
        if [ $? -eq 0 ]; then
            echo "? Archivo copiado al host: $BACKUPS_DIR/$(basename "$DUMP_FILE")" >> "$LOG_FILE"
        else
            echo "? ERROR al copiar el archivo del contenedor al host." >> "$LOG_FILE"
            return 1
        fi
        
        # Limpia el archivo temporal del contenedor
        docker exec "$CONTAINER" rm "$DUMP_FILE"
        
        return 0
    else
        echo "? ERROR al ejecutar pg_dump dentro del contenedor." >> "$LOG_FILE"
        return 1
    fi
}

ejecutar_autolimpieza() {
    echo "?? Iniciando autolimpieza (retención: $DIAS_RETENCION días)..." >> "$LOG_FILE"
    
    # Encuentra y elimina archivos de respaldo mÃ¡s antiguos que $DIAS_RETENCION días
    find "$BACKUPS_DIR" -type f -name 'riesgos_data_*.dump' -mtime +$DIAS_RETENCION -exec rm -v {} \; >> "$LOG_FILE" 2>&1

    echo "? Autolimpieza completada." >> "$LOG_FILE"
}

# --- Ejecución Principal ---

# 1. Autosaneamiento
verificar_y_sanear_db

if [ $? -ne 0 ]; then
    echo "? PROCESO TERMINADO CON FALLO CRÍTICO DE SANEO." >> "$LOG_FILE"
    exit 1
fi

# 2. Respaldo
ejecutar_respaldo

# 3. Autolimpieza
ejecutar_autolimpieza

echo "PROCESO FINALIZADO: $(date)" >> "$LOG_FILE"
echo "=========================================" >> "$LOG_FILE"
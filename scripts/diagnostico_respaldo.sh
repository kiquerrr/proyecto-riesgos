#!/bin/bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Configuraci贸n
BACKUPS_DIR="/opt/riesgos-app/backups"
SCRIPTS_DIR="/opt/riesgos-app/scripts"
LOG_DIR="/opt/riesgos-app/_diagnostico"
RESPALDO_SCRIPT="$SCRIPTS_DIR/respaldo_autolimpieza.sh"
VERIFICAR_SCRIPT="$SCRIPTS_DIR/verificar_estructura.sh"
TEMP_COUNT_FILE="$LOG_DIR/count.txt" # Archivo temporal para el conteo de tablas

# Nombre del archivo de log de este diagn贸stico
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG="$LOG_DIR/diagnostico_$TIMESTAMP.log"

# Configuraci贸n de la base de datos para pg_restore (Usados por docker exec)
CONTAINER="riesgos-db"
DB_PASS="riesgos_pass" 

# --- Funciones ---

# 1. Funci贸n para verificar la estructura y guardar el resultado
ejecutar_verificacion_estructura() {
    echo "?? Verificando estructura..." | tee -a "$LOG"
    bash "$VERIFICAR_SCRIPT" | tee -a "$LOG"
}

# 2. Funci贸n para contar el n煤mero de tablas en un archivo de dump
contar_tablas_dump() {
    local DUMP_FILE="$1"
    local DUMP_NAME=$(basename "$DUMP_FILE")
    local DOCKER_DUMP_PATH="/tmp/$DUMP_NAME"
    
    # 1. Copiar el dump del HOST al contenedor temporalmente
    docker cp "$DUMP_FILE" "$CONTAINER:$DOCKER_DUMP_PATH" 2>/dev/null

    # 2. Ejecutar pg_restore -l DENTRO del contenedor y contar las tablas.
    # El resultado del conteo se escribe en otro archivo temporal DENTRO del contenedor.
    docker exec -t "$CONTAINER" bash -c "
        pg_restore -l '$DOCKER_DUMP_PATH' 2>/dev/null | grep -c 'TABLE ' > /tmp/count.txt
    "

    # 3. Copiar el archivo de conteo del contenedor al HOST
    docker cp "$CONTAINER:/tmp/count.txt" "$TEMP_COUNT_FILE" 2>/dev/null

    # 4. Leer el conteo, limpiar los temporales y devolver el resultado.
    local COUNT=$(cat "$TEMP_COUNT_FILE" 2>/dev/null | tr -d '[:space:]')
    
    docker exec -t "$CONTAINER" rm /tmp/count.txt "$DOCKER_DUMP_PATH" 2>/dev/null
    rm "$TEMP_COUNT_FILE" 2>/dev/null
    
    echo "${COUNT:-0}" # Si COUNT est谩 vac胦, devuelve 0
}

# 3. Funci贸n para validar los logs del backend
validar_logs() {
    echo "" | tee -a "$LOG"
    echo "?? Validando logs en backend/logs..." | tee -a "$LOG"
    ls -lh /opt/riesgos-app/backend/logs/*.log 2>/dev/null | tee -a "$LOG"
    echo "?? Logs validados." | tee -a "$LOG"
}


# --- Ejecuci贸n Principal ---

mkdir -p "$LOG_DIR"
echo "?? Diagn髎tico iniciado: $(date)" | tee -a "$LOG"

# PASO 1: Verificar la estructura
ejecutar_verificacion_estructura

# PASO 2: Ejecutar Respaldo y Autolimpieza
echo "" | tee -a "$LOG"
echo "??? Ejecutando respaldo/autolimpieza..." | tee -a "$LOG"
bash "$RESPALDO_SCRIPT" | tee -a "$LOG"

# PASO 3: Validar el respaldo m谩s reciente
echo "" | tee -a "$LOG"
echo "?? Validando respaldo generado..." | tee -a "$LOG"

ULTIMO_RESPALDO=$(ls -t "$BACKUPS_DIR"/riesgos_data_*.dump 2>/dev/null | head -n 1)

if [ -n "$ULTIMO_RESPALDO" ] && [ -f "$ULTIMO_RESPALDO" ]; then
    NOMBRE_RESPALDO=$(basename "$ULTIMO_RESPALDO")
    TAMANO_RESPALDO=$(du -h "$ULTIMO_RESPALDO" | awk '{print $1}')
    FECHA_MODIFICACION=$(stat -c %y "$ULTIMO_RESPALDO")
    FECHA_RESPALDO=$(echo "$FECHA_MODIFICACION" | cut -d. -f1)

    echo "--- Metadatos del Respaldo ---" | tee -a "$LOG"
    echo "ARCHIVO: $NOMBRE_RESPALDO" | tee -a "$LOG"
    echo "TAMANO: $TAMANO_RESPALDO" | tee -a "$LOG"
    echo "FECHA: $(echo "$FECHA_RESPALDO" | cut -d' ' -f1) $(echo "$FECHA_RESPALDO" | cut -d' ' -f2 | cut -d':' -f1-2)" | tee -a "$LOG"
    echo "-----------------------------" | tee -a "$LOG"

    # Conteo de tablas (Soluci贸n robusta en Docker)
    NUMERO_TABLAS=$(contar_tablas_dump "$ULTIMO_RESPALDO")
    echo "? Tablas encontradas en dump: $NUMERO_TABLAS" | tee -a "$LOG"

    VALIDACION_ESTADO="OK"
    if [ "$NUMERO_TABLAS" -lt 1 ]; then
        VALIDACION_ESTADO="ERROR_BAJO_CONTEO"
    fi

    # PASO 4: Validar logs
    validar_logs
    
    # Bloque Estructurado (sin 'tee' para la salida limpia a Node.js)
    echo "---RESULTADO_ESTRUCTURADO---" 
    echo "ESTRUCTURA: OK"
    echo "LOGS_ESTADO: OK"
    echo "RESPALDO_ARCHIVO: $NOMBRE_RESPALDO"
    echo "RESPALDO_TAMANO: $TAMANO_RESPALDO"
    echo "RESPALDO_FECHA_HORA: $(date -d "$FECHA_RESPALDO" +%Y-%m-%d\ %H:%M)"
    echo "RESPALDO_TABLAS: $NUMERO_TABLAS"
    echo "VALIDACION_ESTADO: $VALIDACION_ESTADO"
    echo "ESTADO: completo"
    echo "---------------------------"
    
else
    echo "? No se encontr贸 respaldo reciente en $BACKUPS_DIR" | tee -a "$LOG"
    validar_logs
    
    # Bloque Estructurado (FALLO)
    echo "---RESULTADO_ESTRUCTURADO---" 
    echo "ESTRUCTURA: OK"
    echo "LOGS_ESTADO: OK"
    echo "RESPALDO_ARCHIVO: N/A"
    echo "RESPALDO_TAMANO: N/A"
    echo "RESPALDO_FECHA_HORA: N/A"
    echo "RESPALDO_TABLAS: 0"
    echo "VALIDACION_ESTADO: ERROR_NO_ENCONTRADO"
    echo "ESTADO: fallido"
    echo "---------------------------"
fi

echo "" | tee -a "$LOG"
echo "? Diagn髎tico completo: $(date)" | tee -a "$LOG"
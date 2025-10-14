#!/bin/bash
# registrar_auditoria.sh – Agrega una entrada al archivo diagnostico_log.json

LOG_PATH="/opt/riesgos-app/_diagnostico/diagnostico_log.json"

# Parámetros esperados
FECHA=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
TABLAS_VERIFICADAS=$1
RESULTADO=$2
OBSERVACIONES=$3

# Validación básica
if [[ -z "$TABLAS_VERIFICADAS" || -z "$RESULTADO" || -z "$OBSERVACIONES" ]]; then
  echo "Uso: $0 <tablas_verificadas> <resultado> <observaciones>"
  exit 1
fi

# Crear entrada JSON
NUEVA_ENTRADA=$(jq -n \
  --arg fecha "$FECHA" \
  --argjson tablas_verificadas "$TABLAS_VERIFICADAS" \
  --arg resultado "$RESULTADO" \
  --arg observaciones "$OBSERVACIONES" \
  '{fecha: $fecha, tablas_verificadas: $tablas_verificadas, resultado: $resultado, observaciones: $observaciones}')

# Si el archivo no existe, lo inicializa
if [[ ! -f "$LOG_PATH" ]]; then
  echo "[]" > "$LOG_PATH"
fi

# Agregar entrada al array
jq ". += [$NUEVA_ENTRADA]" "$LOG_PATH" > "${LOG_PATH}.tmp" && mv "${LOG_PATH}.tmp" "$LOG_PATH"

echo "Auditoría registrada correctamente."

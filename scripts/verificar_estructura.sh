#!/bin/bash
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

ROOT="/opt/riesgos-app"
LOG="$ROOT/backend/logs/verificacion_estructura_$(date +%Y%m%d_%H%M%S).log"

echo "📋 Verificación de estructura iniciada: $(date)" | tee "$LOG"
echo "------------------------------------------------------------" | tee -a "$LOG"

# 🔍 Define carpetas y archivos esperados
declare -A EXPECTADOS=(
  ["api/server.js"]="Archivo principal del backend"
  ["api/routes/admin.js"]="Ruta admin"
  ["api/controllers/admin/respaldoAutolimpieza.js"]="Controlador de respaldo"
  ["api/middleware/verificarAdmin.js"]="Middleware de verificación"
  ["scripts/respaldo_autolimpieza.sh"]="Script de limpieza"
  ["backend/logs/autolimpieza.log"]="Log de limpieza"
  ["backups"]="Carpeta de respaldos"
)

# 🔎 Revisión
for path in "${!EXPECTADOS[@]}"; do
  FULL="$ROOT/$path"
  if [ -f "$FULL" ]; then
    echo "✅ $path → OK (${EXPECTADOS[$path]})" | tee -a "$LOG"
  elif [ -d "$FULL" ]; then
    echo "📁 $path → Carpeta encontrada (${EXPECTADOS[$path]})" | tee -a "$LOG"
    ls -1 "$FULL" | tee -a "$LOG"
  else
    echo "❌ $path → FALTANTE (${EXPECTADOS[$path]})" | tee -a "$LOG"
  fi
done

echo "------------------------------------------------------------" | tee -a "$LOG"
echo "✅ Verificación completada: $(date)" | tee -a "$LOG"

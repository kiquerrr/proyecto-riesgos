#!/bin/bash

echo "📦 Iniciando organización del proyecto..."

# 🧱 Crear carpetas
mkdir -p /opt/riesgos-app/api/{routes,controllers/admin,middleware,models,utils}
mkdir -p /opt/riesgos-app/backend/{funciones,logs}
mkdir -p /opt/riesgos-app/frontend/admin
mkdir -p /opt/riesgos-app/scripts
mkdir -p /opt/riesgos-app/backups
mkdir -p /opt/riesgos-app/db
mkdir -p /opt/riesgos-app/info
mkdir -p /opt/riesgos-app/docs

# 📋 Verificar archivos clave
echo ""
echo "🔍 Verificando archivos importantes..."

check_file() {
  if [ -f "$1" ]; then
    echo "✅ $1 encontrado"
  else
    echo "❌ $1 no existe"
  fi
}

check_file "/opt/riesgos-app/api/server.js"
check_file "/opt/riesgos-app/scripts/respaldo_autolimpieza.sh"
check_file "/opt/riesgos-app/backend/logs/autolimpieza.log"
check_file "/opt/riesgos-app/docs/arquitectura.md"
check_file "/opt/riesgos-app/README.md"

echo ""
echo "✅ Organización completada. Revisa los archivos marcados ❌ para crearlos o moverlos."

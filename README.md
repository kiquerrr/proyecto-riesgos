cat > README.md << 'EOF'
# Riesgos App – Plataforma de Diagnóstico, Respaldo y Auditoría

Sistema modular para monitoreo, respaldo y saneamiento de datos en entornos críticos. Diseñado para trazabilidad, resiliencia operativa y escalabilidad técnica.

---

## Estructura del Proyecto

# Esta sección describe la organización de carpetas del sistema.
# Cada módulo tiene una responsabilidad clara.

riesgos-app/
+-- api/                  # Backend Node.js con rutas, controladores y middleware
+-- frontend/admin/       # Dashboard React para administración y monitoreo
+-- backups/              # Respaldos PostgreSQL (.dump, .sql)
+-- _diagnostico/         # Logs de diagnóstico estructurados
+-- db/                   # Infraestructura Docker
+-- docs/                 # Documentación técnica
+-- scripts/              # Shell scripts para diagnóstico y respaldo
+-- estructura_directorios.txt
+-- README.md

---

## Instalación

# Clona el repositorio y prepara el entorno de desarrollo.

# 1. Clonar el repositorio
git clone https://github.com/kiquerrr/proyecto-riesgos.git
cd proyecto-riesgos

# 2. Instalar dependencias del backend
cd api
npm install

# 3. Instalar dependencias del frontend
cd ../frontend/admin
npm install

---

## Ejecución

# Inicia los servidores de backend y frontend.

# 1. Iniciar backend
cd /opt/riesgos-app/api
npm start

# 2. Iniciar frontend
cd /opt/riesgos-app/frontend/admin
npm start

---

## Token de prueba

# Este token se usa para acceder a rutas protegidas durante desarrollo.

const TOKEN_TEST = 'TU_TOKEN_DE_PRUEBA_AQUI';

---

## Flujo de Diagnóstico

# Describe el proceso completo de verificación y respaldo.

1. Ejecutar `diagnostico_respaldo.sh`
2. Verifica estructura y respaldo con `pg_dump`
3. Valida integridad con `pg_restore -l`
4. Registra resultado en `diagnostico_log.json`
5. Visualiza en el dashboard React

---

## Rutas API

# Endpoints disponibles en el backend

- GET /admin/data/precios/monedas – Tasas simuladas
- GET /admin/logs/respaldo – Últimos logs (requiere token)
- POST /admin/saneamiento/db/restart – Reinicio forzado (requiere token)

---

## Limpieza aplicada

# Cambios recientes en la estructura del proyecto

- Carpeta backend/ eliminada tras respaldo
- Código migrado a api/ y scripts/
- Confirmado en commit 47b2944

---

## Estado actual

- Backend funcional  
- Frontend integrado  
- Diagnóstico operativo  
- Auditoría trazable  
- Proyecto en Git (main)

---

## Autor

Luis – Arquitecto de sistemas, resiliente y estratégico.  
Este proyecto está diseñado para escalar, auditar y evolucionar.
EOF

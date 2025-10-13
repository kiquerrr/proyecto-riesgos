# 🧠 Arquitectura de Riesgos App

Este documento describe la estructura técnica del sistema, sus componentes y flujos críticos.

## 🧱 Componentes principales

- **api/**: Servidor Express que expone los endpoints REST
- **backend/**: Lógica del sistema, controladores, funciones SQL, logs
- **frontend/**: Panel administrativo para usuarios con rol `admin`
- **scripts/**: Scripts bash para respaldo y limpieza
- **backups/**: Carpeta donde se almacenan los `.dump` de PostgreSQL
- **db/**: Inicialización de la base de datos
- **info/**: Variables de entorno y configuración
- **docs/**: Documentación técnica

## 🔁 Flujo de respaldo + autolimpieza

1. El administrador ejecuta `/admin/respaldo-autolimpieza` desde el panel
2. El backend ejecuta `scripts/respaldo_autolimpieza.sh`
3. El script:
   - Genera un respaldo en `/opt/riesgos-app/backups/`
   - Ejecuta `autolimpieza_segura()` en PostgreSQL
   - Registra todo en `backend/logs/autolimpieza.log`
4. El backend responde con:
   - Ruta del respaldo
   - Resultado de la limpieza
   - Últimas líneas del log

## 🔐 Seguridad

- Solo usuarios con rol `admin` pueden ejecutar la limpieza
- Todas las acciones quedan registradas en logs
- El sistema está diseñado para ser auditable y reproducible

## 🧪 Pruebas

Puedes probar el endpoint con:

```bash
curl -X POST http://localhost:3000/admin/respaldo-autolimpieza \
  -H "Content-Type: application/json" \
  -d '{"confirmacion": true}'

# 📊 Riesgos App

Sistema de control financiero con respaldo automatizado, flujos de limpieza segura y panel administrativo.

## 📁 Estructura del proyecto


/opt/riesgos-app/ ├
── api/ # Servidor Express (Node.js) 
├── backend/ # Controladores, funciones SQL, logs 
├── frontend/ # Panel administrativo 
├── scripts/ # Scripts bash automatizados 
├── backups/ # Respaldos de la base de datos 
├── db/ # Inicialización de PostgreSQL 
├── info/ # Configuración y entorno 
├── docs/ # Documentación técnica 
└── README.md # Este archivo

## 🚀 Funcionalidades clave

- Respaldos automáticos de la base de datos
- Ejecución segura de autolimpieza con doble confirmación
- Logs detallados para auditoría
- Panel administrativo protegido por rol
- Estructura modular y mantenible

## 📦 Scripts importantes

- `scripts/respaldo_autolimpieza.sh`: ejecuta respaldo + limpieza segura
- `backend/logs/autolimpieza.log`: historial de ejecuciones

## 🧠 Documentación técnica

Ver `/docs/arquitectura.md` para detalles de diseño, flujos y decisiones técnicas.

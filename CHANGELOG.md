# Changelog - Proyecto Riesgos

## [1.0.0] - 2025-10-14

### Completado

#### Backend
- ✅ Servidor Node.js/Express configurado en puerto 3000
- ✅ 4 endpoints principales operativos:
  - GET `/` - API en funcionamiento
  - GET `/admin/*` - Rutas administrativas
  - POST `/auth/login` - Autenticación con JWT
  - GET `/tasas` - Consulta de tasas de cambio
- ✅ JWT tokens generándose correctamente desde .env
- ✅ CORS configurado para permitir peticiones del frontend
- ✅ Base de datos PostgreSQL conectada
- ✅ Middleware de autenticación implementado

#### Frontend
- ✅ Webpack dev server corriendo en puerto 8080
- ✅ React admin panel cargando correctamente
- ✅ 3 componentes principales:
  - SaneamientoCard - Control de resiliencia de BD
  - MonedasCard - Tasas de cambio
  - LogCard - Logs de respaldo y limpieza
- ✅ Conexión exitosa frontend-backend
- ✅ CORS funcionando correctamente

#### Estructura y Organización
- ✅ Git inicializado y conectado a GitHub
- ✅ .gitignore configurado correctamente
- ✅ Variables de entorno (.env) configuradas
- ✅ Punto de entrada unificado (api/app.js)
- ✅ Controllers no usados eliminados
- ✅ Estructura de carpetas limpia y modular

#### Commits
1. Initial commit: proyecto riesgos estructura base
2. feat: add missing dependencies (cors, body-parser, nodemon)
3. fix: repair corrupted admin.js route file
4. fix: consolidate app entry point and add all routes to main server
5. fix: update frontend API connection and component data handling
6. fix: configure CORS and update frontend API connection
7. refactor: remove unused admin controllers

### Configuración Actual

**Backend:**
- Express.js 4.18.2
- PostgreSQL (riesgos_user, riesgos_data)
- JWT Secret: desde .env
- Puerto: 3000

**Frontend:**
- React 18.2.0
- Webpack 5
- Babel configurado
- Puerto: 8080

**Base de Datos:**
- Host: localhost
- Puerto: 5432
- BD: riesgos_data
- Usuario: riesgos_user

### Estado del Proyecto
```
BACKEND:     ✅ Funcional
FRONTEND:    ✅ Funcional
DATABASE:    ✅ Conectada
API:         ✅ Operativa
GIT:         ✅ Versionado
```

### Próximas Fases

- [ ] Revisar esquema de base de datos
- [ ] Validar integridad de datos
- [ ] Expandir funcionalidad del frontend
- [ ] Agregar más endpoints
- [ ] Implementar validaciones adicionales
- [ ] Crear documentación completa de API

### Notas Técnicas

- Frontend necesita acceder por IP real del contenedor (10.68.222.26) no por localhost
- VPN puede bloquear acceso a IPs locales de red
- Webpack hot reload funciona correctamente para desarrollo
- nodemon reinicia backend automáticamente en cambios


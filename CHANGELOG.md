## [2025-10-14] Auditoría automatizada integrada

- Se creó el script `registrar_auditoria.sh` para registrar auditorías en `diagnostico_log.json`
- Se integró automáticamente dentro de `diagnostico_respaldo.sh` usando variables reales del diagnóstico
- Se eliminó redundancia en llamadas al script
- Se validó que el archivo `diagnostico_log.json` tenga formato correcto y se actualice sin duplicados
- Confirmado que el frontend (`AuditoriaCard.js`) consume los datos correctamente desde la ruta `/admin/logs/auditorias`

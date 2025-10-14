## [2025-10-14] Auditor�a automatizada integrada

- Se cre� el script `registrar_auditoria.sh` para registrar auditor�as en `diagnostico_log.json`
- Se integr� autom�ticamente dentro de `diagnostico_respaldo.sh` usando variables reales del diagn�stico
- Se elimin� redundancia en llamadas al script
- Se valid� que el archivo `diagnostico_log.json` tenga formato correcto y se actualice sin duplicados
- Confirmado que el frontend (`AuditoriaCard.js`) consume los datos correctamente desde la ruta `/admin/logs/auditorias`

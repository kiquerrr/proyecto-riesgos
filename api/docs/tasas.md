# Endpoint `/tasas`

Consulta la tasa de cambio entre dos monedas.

## Parámetros

- `origen`: código de moneda origen (ej. `USD`)
- `destino`: código de moneda destino (ej. `VES`)
- `minutos`: (opcional) si se especifica, verifica si la tasa local está desactualizada
- `fuente`: (opcional) fuente preferida para consulta externa

## Ejemplo

```bash
curl "http://localhost:3000/tasas?origen=USD&destino=VES&minutos=30"

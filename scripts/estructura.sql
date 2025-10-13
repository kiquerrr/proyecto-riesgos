-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  clave TEXT NOT NULL,
  ip_registro TEXT,
  ubicacion TEXT,
  rol TEXT CHECK (rol IN ('admin', 'usuario')) DEFAULT 'usuario',
  fecha_registro TIMESTAMP DEFAULT NOW()
);

-- Tabla de monedas
CREATE TABLE IF NOT EXISTS monedas (
  id SERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('fiat', 'cripto')) NOT NULL,
  pais TEXT,
  decimales INT DEFAULT 2,
  activo BOOLEAN DEFAULT TRUE
);

-- Inserción inicial de monedas (solo si no existen)
INSERT INTO monedas (codigo, nombre, tipo, pais)
SELECT 'USD', 'Dólar estadounidense', 'fiat', 'Estados Unidos'
WHERE NOT EXISTS (SELECT 1 FROM monedas WHERE codigo = 'USD');

INSERT INTO monedas (codigo, nombre, tipo, pais)
SELECT 'VES', 'Bolívar digital', 'fiat', 'Venezuela'
WHERE NOT EXISTS (SELECT 1 FROM monedas WHERE codigo = 'VES');

INSERT INTO monedas (codigo, nombre, tipo, pais)
SELECT 'USDT', 'Tether', 'cripto', 'Internacional'
WHERE NOT EXISTS (SELECT 1 FROM monedas WHERE codigo = 'USDT');

INSERT INTO monedas (codigo, nombre, tipo, pais)
SELECT 'EUR', 'Euro', 'fiat', 'Unión Europea'
WHERE NOT EXISTS (SELECT 1 FROM monedas WHERE codigo = 'EUR');

INSERT INTO monedas (codigo, nombre, tipo, pais)
SELECT 'COP', 'Peso colombiano', 'fiat', 'Colombia'
WHERE NOT EXISTS (SELECT 1 FROM monedas WHERE codigo = 'COP');

-- Tabla de fuentes de tasa
CREATE TABLE IF NOT EXISTS fuentes_tasa (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  url TEXT
);

-- Tabla de tasas
CREATE TABLE IF NOT EXISTS tasas (
  id SERIAL PRIMARY KEY,
  moneda_origen_id INT REFERENCES monedas(id),
  moneda_destino_id INT REFERENCES monedas(id),
  fuente_id INT REFERENCES fuentes_tasa(id),
  valor NUMERIC(18,6) NOT NULL,
  fecha_hora TIMESTAMP DEFAULT NOW()
);

-- Tabla de transacciones
CREATE TABLE IF NOT EXISTS transacciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  moneda_origen_id INT REFERENCES monedas(id),
  moneda_destino_id INT REFERENCES monedas(id),
  monto_origen NUMERIC(18,6) NOT NULL,
  monto_convertido NUMERIC(18,6) NOT NULL,
  tasa_aplicada NUMERIC(18,6) NOT NULL,
  fuente_id INT REFERENCES fuentes_tasa(id),
  fecha_hora TIMESTAMP DEFAULT NOW()
);

-- Tabla de estadísticas
CREATE TABLE IF NOT EXISTS estadisticas (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  moneda_id INT REFERENCES monedas(id),
  tipo TEXT CHECK (tipo IN ('diaria', 'semanal', 'mensual')),
  porcentaje_cambio NUMERIC(6,2),
  fecha TIMESTAMP NOT NULL
);

-- Tabla de logs
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id),
  tipo TEXT CHECK (tipo IN ('acceso', 'error', 'api', 'conversion')),
  mensaje TEXT,
  fecha_hora TIMESTAMP DEFAULT NOW()
);

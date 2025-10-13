const { Pool } = require('pg');

const pool = new Pool({
  user: 'riesgos_user',
  host: 'localhost',
  database: 'riesgos_data',
  password: 'riesgos_pass',
  port: 5432,
});

module.exports = pool;

const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'inventario',
    password: '29758990',
    port: 5432,
});

module.exports = {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    },
    queryAsync: (text, params) => {
        return pool.query(text, params);
    }
}
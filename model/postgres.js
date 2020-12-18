const { Pool } = require('pg');

const pool1 = new Pool({
    user: 'tmxlxvhosmtvkq',
    host: 'ec2-18-211-48-247.compute-1.amazonaws.com',
    database: 'd99m3vggo7435a',
    password: '87a720cf620b348b5ab12138e0a10f8217e312b28449c6a2c742140fb217463a',
    port: 5432,
});

module.exports = {
    query: (text, params, callback) => {
        return pool1.query(text, params, callback)
    },
    queryAsync: (text, params) => {
        return pool1.query(text, params);
    }
}
const {Pool} = require("pg")

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "url_shortener",
    password: "mypwd",
    port: 5432,
});

module.exports = pool;
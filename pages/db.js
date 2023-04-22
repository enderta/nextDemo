const {Pool} = require("pg");

const pool =
    new Pool({
        user: "postgres",
        host: "localhost",
        database: "blog",
        password: "ender",
        port: 5432,
    });

export const connectDb = async () => {
        const client = await pool.connect();
        return {
                client,
                release: () => client.release(),
        };
};

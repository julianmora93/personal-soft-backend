import mysql, { Connection } from 'mysql';

export const createConnection = () => mysql.createConnection({
    host: process.env.ENV_DB_HOST,
    user: process.env.ENV_DB_USER,
    password: process.env.ENV_DB_PASSWORD,
    database: process.env.ENV_DB_DATA_BASE
});

export const queryProcess = (sql: string, connection: Connection, parameters?: any[]) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, parameters, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};
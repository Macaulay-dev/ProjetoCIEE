import sql from 'mssql';
let poolPromise;
export function getPool() {
  if (!poolPromise) {
    const config = {
      server: process.env.DB_SERVER || 'localhost',
      port: Number(process.env.DB_PORT || 1433),
      database: process.env.DB_NAME || 'CieeCurriculos',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE === 'true'
      }
    };
    poolPromise = new sql.ConnectionPool(config).connect().catch(error => { poolPromise = undefined; throw error; });
  }
  return poolPromise;
}
export { sql };

const mysql = require('mysql2')

// create pool
// TODO: move db config to separate file
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'test',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

// log information
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId)
})
pool.on('connection', function (connection) {
  console.log('New connection made')
})
pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId)
})

// create promise version
const promisePool = pool.promise()

// to ping database for common exception errors
async function ping() {
  try {
    await promisePool.getConnection()
  } catch(err) {
    switch(err.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        console.error('Database connection was closed.')
        break
      case 'ER_CON_COUNT_ERROR':
        console.error('Database has too many connections.')
        break
      case 'ECONNREFUSED':
        console.error('Database connection was refused.')
        break
      default:
      console.error(err)
    } 
    return
  }
}

module.exports = { promisePool, ping }
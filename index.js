require('dotenv').config()
const express = require('express')
const { promisePool, ping } = require('./database')
const app = express()

// constants
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || '127.0.0.1'

const router = express.Router()

// this is only useful if something is wrong with the sql server
router.get('/ping', (req, res) => {
  return ping()
})

// create table and insert sample data
router.get('/create', async (req, res) => {
    // CREATE TABLE
    let sql = `CREATE TABLE IF NOT EXISTS products (
      id int(11) NOT NULL AUTO_INCREMENT,
      name varchar(50) NOT NULL,
      description varchar(255) NOT NULL,
      price int(11) DEFAULT 0,
      PRIMARY KEY (id)
    )`
    try {
      await promisePool.query(sql)
      console.log('Table products created')
    } catch(err) {
      console.error(err)
      return res.sendStatus(500)
    }

    // INSERT SAMPLE DATA
    sql = 'INSERT INTO products (name, description, price) VALUES ?'
    const values = [
      ['Product 1', 'An incredible product', 2500],
      ['Product 2', 'An even better product', 3000],
      ['Product 3', 'An awesome product', 2800]
    ] 
    try {
      await promisePool.query(sql, [values])      
      console.log(`${values.length} rows inserted`)
    } catch(err) {
      console.error(err)
      return res.sendStatus(500)
    }
    res.send('All done')
})

// get a list of products
router.get('/products', async (req, res) => {  
  // user provided data
  const price = 2500
  // just to show how to bind data for prepared statement
  const sql = 'SELECT * FROM products WHERE price = ? OR TRUE'
  try {
    // use execute instead of query for prepared statements
    const [results, fields] = await promisePool.execute(sql, [price])
    return res.json(results)
  } catch(err) {
    console.error(err)
    return res.sendStatus(500)
  }
})

// middleware
app.use(router)

//start
app.listen(3000, () => console.log(`Listening on http://${HOST}:${PORT}`))
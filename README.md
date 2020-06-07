# mysql2 example

Example using the [mysql2](https://www.npmjs.com/package/mysql2) package to query a database. 

This example uses the pool version to provide a connection. It also uses the _promise()_ method to provide the pool as a promise. Queries are made using async/await and try/catch for any errors. 

When requesting the provided routes, it will log 3 callbacks from the pool:
* on aquire connection
* on new connection made
* on release

## Installation
Install dependencies with:

```
npm install
```
Run it with:
```
npm run dev
```
## Usage
Check or modify the configuration to connect to mysql and the  database name.

Default values are located in _database.js_ and are as follows:
```
host: 'localhost',
user: 'root',
database: 'test',
```
To create the table and populate with sample data navigate to:
```
http://localhost:3000/create
```
To display the data (use a select query) navigate to:
```
http://localhost:3000/products
```
This last requests uses the _execute()_ method that creates prepared statements protecting against possible sql injection.

## Prepared statements
As mentioned above, the route _/products_ uses prepared statements to query the db. There're three things to do for this:

```js
// (1) use ? for fields that need to be filled with possible malicius data
const sql = 'SELECT * FROM products WHERE col1 = ? AND col2 = ?';

// use execute rather than query
// pass the data as an array (in the same order) as a secoond parameter
pool.execute(sql, [userInput1, userInput2])
```

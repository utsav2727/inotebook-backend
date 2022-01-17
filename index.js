const connectToMongo = require('./db');
const express = require('express')

//connect to Mongo
connectToMongo();

const app = express()
const port = 5000

//Middlewares
app.use(express.json());

//Available Routes
app.use('/api/v1/auth', require('./routes/auth'))
app.use('/api/v1/notes', require('./routes/notes'))

//listening to the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
const express = require('express')
const mongoose = require('mongoose')
const transactionRoutes = require('./routes/api/transaction')
const categoryRoutes = require('./routes/api/category')
require('dotenv/config')
const app = express()

mongoose.connect(process.env.LOCAL_DB_CONNECTION_URI, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to database') )

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/transactions', transactionRoutes)
app.use('/categories', categoryRoutes)

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log('Server started on port', PORT))
const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv/config')

mongoose.connect(process.env.DB_CONNECTION_URI, { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('Connected to database') )
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/transactions', require('./routes/api/transaction'))

const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log('Server started on port', PORT))
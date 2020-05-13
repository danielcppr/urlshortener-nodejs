const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dbConn = require('./config/db');
const cors = require('cors');


//conexao ao mongo
dbConn()

app.use(express.json({ extended: false}));
app.use(express.urlencoded({ extended: true}))

app.use(cors())

app.use('/', require('./routes/index'))
app.use('/api/url', require('./routes/url'))


const PORT = 4000
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})


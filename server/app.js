const express = require('express');
const dotenv = require('dotenv');
var os = require("os");
const db = require('./db');
dotenv.config();
const app = express();


app.get('/', (req, res) => {
    res.send(`Digitale Kunden Karte says Hey from Host: ${os.hostname()} :)`);
});


app.listen(process.env.LISTEN_PORT, ()=>{
    console.log('Server started on port ' + process.env.LISTEN_PORT);
});
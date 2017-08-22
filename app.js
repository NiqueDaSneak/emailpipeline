'use strict'

// NPM PACKAGES
const express = require('express')
const bodyParser = require('body-parser')

// APP DEFINITION & MIDDLEWARE
var app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.post('/', (req, res, next) => {
  console.log('hello')
  console.log(req.body)
  res.sendStatus(200)
})

// SERVER LISTENING
var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log('Server running on port ' + port);
});
app.on('error', function() {
    console.log(error);
});
module.exports = app;

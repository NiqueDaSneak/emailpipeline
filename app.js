'use strict'

// NPM PACKAGES
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const nodemailer = require('nodemailer')
const fs = require('fs')

// APP DEFINITION & MIDDLEWARE
var app = express()

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

var mg = require('nodemailer-mailgun-transport')

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-4469d9529c24f6989f65627381a3112a',
    domain: 'sandbox0821fafc203647ceaf463389169de76c.mailgun.org'
  }
}

var nodemailerMailgun = nodemailer.createTransport(mg(auth))


// ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/form.html'))
})

app.get('/preview', (req, res) => {
  // res.sendFile(path.join(__dirname + '/responsive-email.html'))
  res.sendFile(path.join(__dirname + '/responsive-email.html'))
})

app.post('/case-study-request', (req, res, next) => {
  var email = fs.readFileSync('responsive-email.html', 'utf8')
  nodemailerMailgun.sendMail({
    from: 'info@BSLLC.biz',
    to: req.body.email, // An array if you have multiple recipients.
    // to: [req.body.email, 'sebastien@bsllc.biz'], // An array if you have multiple recipients.
    // cc:'second@domain.com',
    // bcc:'secretagent@company.gov',
    subject: 'Test 9/12 60',
    // 'h:Reply-To': 'reply2this@company.com',
    //You can use "html:" to send HTML email content. It's magic!
    html: email,
    attachments: [{
        filename: 'Header.jpg',
        path: "public/imgs/Header.jpg",
        cid: 'bsllc@Header.jpg' //same cid value as in the html img src
      },
      {
        filename: 'middle.jpg',
        path: "public/imgs/middle.jpg",
        cid: 'bsllc@middle.jpg' //same cid value as in the html img src
      }
    ],
    //You can use "text:" to send plain-text content. It's oldschool!
    text: 'Mailgun rocks, pow pow!'
  }, function(err, info) {
    if (err) {
      console.log('Error: ' + err)
    } else {
      console.log('Response: ' + JSON.stringify(info))
    }
  })
  res.sendStatus(200)
})

app.post('/download-design-port', (req, res, next) => {
  res.sendStatus(200)
})

app.post('/design-question', (req, res, next) => {
  res.sendStatus(200)
})

app.post('/research-question', (req, res, next) => {
  res.sendStatus(200)
})

app.post('/research-approach', (req, res, next) => {
  res.sendStatus(200)
})

app.post('/copy-question', (req, res, next) => {
  res.sendStatus(200)
})

app.post('/read-work', (req, res, next) => {
  res.sendStatus(200)
})

// SERVER LISTENING
var port = process.env.PORT || 3000
app.listen(port, function() {
  console.log('Server running on port ' + port)
})
app.on('error', function() {
  console.log(error)
})
module.exports = app

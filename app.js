'use strict'

// NPM PACKAGES
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const nodemailer = require('nodemailer')
const fs = require('fs')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

// APP MIDDLEWARE
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

// DATABASE SETUP
const mongoose = require('mongoose')
mongoose.connect('mongodb://admin:adminpassword@ds147044.mlab.com:47044/bsllc-email-pipeline')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))

var assetSchema = mongoose.Schema({
  header: String,
  subhead: String,
  description: String,
  link: String
})

var Asset = mongoose.model('Asset', assetSchema)

var recipientSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  dateCreated: Date,
  followedUp: Boolean
})

var Recipient = mongoose.model('Recipient', recipientSchema)

var emailManifestSchema = mongoose.Schema({
  brandStrategy: String,
  researchQuestion: String,
  design: String,
  copywriting: String
})

var Manifest = mongoose.model('Manifest', emailManifestSchema)

// ROUTES
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/form.html'))
})

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname + '/dashboard.html'))
})

app.get('/preview', (req, res) => {
  // res.sendFile(path.join(__dirname + '/responsive-email.html'))
  res.sendFile(path.join(__dirname + '/responsive-email.html'))
})

app.post('/case-study-request', (req, res) => {
  var caseStudy = {}
  var email
  if (req.body['case-study'] === 'https://bsllc.biz/wp-content/uploads/2017/03/BSLLC-Case-Study_Archive-of-Thirst.pdf') {
    caseStudy.header = 'Archive of Thirst'
    caseStudy.subHead = 'Rhinegeist Brewery'
    caseStudy.description = "An award-winning campagin that helped Rhinegeist launch Cidergeist in two new markets. We connected with founders Bob Bonder and Bryant Goulding to distill Rhinegeist's culture into something their sales team could hold in their hands and make people say wow."
    caseStudy.link = 'https://bsllc.biz/wp-content/uploads/2017/03/BSLLC-Case-Study_Archive-of-Thirst.pdf'
  } else {
    caseStudy.header = 'A Brand Aquatic'
    caseStudy.subHead = 'Eighth & English'
    caseStudy.description = 'Chase B. cooked at the best restaurants in his city. He took over flailing kitches and turned them arounds. He quit the industry for five minutes and then came back because he missed the heat. \nIt was time for him to do him. It was time to open his own place. After taking over the lease to a built-out space, Chase asked us to build his brand. Together, we created Eighth & English.'
    caseStudy.link = 'https://bsllc.biz/wp-content/uploads/2017/03/8thEnglish_CaseStudy.pdf'
  }

  var firstName = req.body['your-name'].split(' ')[0]
  // var email = fs.readFileSync('responsive-email.html', 'utf8')
  email = '<!DOCTYPE html>'+
  '<html>'+
  ''+
  '<head>'+
  '  <meta charset="utf-8">'+
  '  <title>Email</title>'+
  '</head>'+
  ''+
  '<body style="color: #342e1f; margin: 0 auto; background-color: #F0EEE6; padding-top: 5vh;">'+
  '  <section style="margin-bottom: 14vh;">'+
  '    <img style="width: 100%; font-size: 10%;" src="cid:bsllc@Header.jpg" alt="Header Image">'+
  '    <div style="width: 70%; margin-left: 15%;" class="email-body">'+
  '      <p style="font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace">Hi ' + firstName + ',</p>'+
  '      <p style="font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace">We received your inquiry, so this is just a holdover to say thanks for reaching out. We\'re not into the belabored formalities of never-ending email exchanges, so if you\'d prefer to chat via phone, skype, or face-to-face over coffee, we\'re happy'+
  '        to set up a time to discuss your brand\'s challenges. If that\'s the case, then respond to this email with dates and times that work for you and we will get a meeting on the books.</p>'+
  '      <p style="font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace">If that\'s not your thing, we\'re happy to completely abandon our original statement and email back and forth until we fully understand the nature of your project.</p>'+
  '      <p style="font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace">Above all, thank you for taking the time to check us out. We look forward to hopefully building something together that creates lasting impact and success.</p>'+
  '      <p style="font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace">All the best,</p>'+
  '      <p style="font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace">BS LLC</p>'+
  '    </div>'+
  '  </section>'+
  ''+
  '  <img style="width: 100%;" src="cid:bsllc@middle.jpg" alt="">'+
  ''+
  '  <section style="margin-bottom: 10vh;">'+
  '    <p style="color: #54A3DA; margin-top: 7%; margin-bottom: 7%; font-style: italic; font-family: sans-serif; font-size: 13pt; margin-left: 12.5%" class="head">' + firstName + ', Your Requested Work</p>'+
  '    <div class="work-item" style="margin-left: 12.5%;">'+
  '      <span style="font-family: \'Lato\', sans-serif; font-weight: bold; font-size: 14pt;">' + caseStudy.header + '</span>'+
  '      <span style="display: block; margin-bottom: 5vh; font-family: \'Lato\', sans-serif;">' + caseStudy.subHead + '</span>'+
  '      <p style="width: 75%; font-family: \'Lato\', sans-serif;">' + caseStudy.description + '</p>'+
  '      <a class="download-here" href=' + caseStudy.link + ' style="max-width: 40%; text-align: center; display: block; background-color: #54a3da; text-decoration: none; color: #F0EEE6; padding-top: 2%; padding-bottom: 2%; margin-top: 10%; margin-bottom: 15%; font-family: \'Lato\', sans-serif;">Download Here</a>'+
  '    </div>'+
  '  </section>'+
  ''+
  '  <div style="background-color: #dfded7; width: 100%; margin-top: 14%; padding-top: 10%;">'+
  '    <span style="text-align: center; color: #f0eee6; font-size: 15pt; display: block; font-family: \'Lato\', sans-serif;">BSLLC IS A CREATIVE CONSULTANCY</span>'+
  '    <p style=" text-align: center; margin-left: 15%; color: #f0eee6; width: 70%; font-size: 9pt; font-family: \'Lato\', sans-serif; margin-bottom: 5%;">focused on branding and marketing. We employ science and art, the cornerstones of effective and beautiful communication, to create meaningful solutions for brands.</p>'+
  '    <div style="text-align: center;">'+
  '      <span style="font-size: 12pt; font-family: \'Lato\', sans-serif; font-weight: bold;"><a style="color: #969292 !important; text-decoration: none !important;" href="tel:(513)%20427-5526" value="+15134275526" target="_blank">CALL</a></span>'+
  '      <span style="font-size: 12pt; margin-left: 10%; margin-right: 10%; font-family: \'Lato\', sans-serif; font-weight: bold;"><a style="color: #969292 !important; text-decoration: none !important;" href="mailto:info.bsllc.biz" target="_blank">EMAIL</a></span>'+
  '      <span style="font-size: 12pt; font-family: \'Lato\', sans-serif; font-weight: bold;"><a style="color: #969292 !important; text-decoration: none !important;" href="http://www.bsllc.biz" target="_blank">WEB</a></span>'+
  '    </div>'+
  '    <hr noshade style="border-color: #f0eee6; width: 80%; margin-top: 2%;">'+
  '    <p style="color: #F0EEE6; text-align: center; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace; margin-top: 5%; font-size: 11pt;">BS LLC DISCIPLINES</p>'+
  '    <table style="text-align: center; width: 80%; margin-left: 10%;" border="0" cellpadding="0" cellspacing="0" width="600" id="templateColumns">'+
  '      <tr>'+
  '        <td align="" valign="top" width="50%" class="templateColumnContainer">'+
  '          <table border="0" cellpadding="10" cellspacing="0" width="100%">'+
  '            <tr>'+
  '              <td class="leftColumnContent">'+
  '                <span style="display: block; padding-bottom: 10%; color: #F0EEE6; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace;">Design</span>'+
  '                <span style="display: block; padding-bottom: 10%; color: #F0EEE6; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace;">Copywriting</span>'+
  '                <span style="display: block; padding-bottom: 10%; color: #F0EEE6; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace;">Photography</span>'+
  ''+
  '              </td>'+
  '            </tr>'+
  '            <tr>'+
  '              <td valign="top" class="leftColumnContent">'+
  '              </td>'+
  '            </tr>'+
  '          </table>'+
  '        </td>'+
  '        <td align="" valign="top" width="50%" class="templateColumnContainer">'+
  '          <table border="0" cellpadding="10" cellspacing="0" width="100%">'+
  '            <tr>'+
  '              <td class="rightColumnContent">'+
  '                <span style="display: block; padding-bottom: 10%; color: #F0EEE6; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace;">Brand Strategy</span>'+
  '                <span style="display: block; padding-bottom: 10%; color: #F0EEE6; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace;">Marketing</span>'+
  '                <span style="display: block; padding-bottom: 10%; color: #F0EEE6; font-family: Courier New, lucida sans trypewriter, lucida typewriter, monspace;">Research</span>'+
  '              </td>'+
  '            </tr>'+
  '            <tr>'+
  '              <td valign="top" class="rightColumnContent">'+
  '              </td>'+
  '            </tr>'+
  '          </table>'+
  '        </td>'+
  '      </tr>'+
  '    </table>'+
  '  </div>'+
  '</body>'+
  ''+
  '</html>'

  nodemailerMailgun.sendMail({
    from: 'info@BSLLC.biz',
    to: req.body['your-email'], // An array if you have multiple recipients.
    // to: [req.body.email, 'sebastien@bsllc.biz'], // An array if you have multiple recipients.
    // cc:'second@domain.com',
    // bcc:'secretagent@company.gov',
    subject: 'BS LLC Case Study',
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
    // text: 'Mailgun rocks, pow pow!'
  }, function(err, info) {
    if (err) {
      console.log('Error: ' + err)
    } else {
      console.log('Response: ' + JSON.stringify(info))
      // SEND EMAIL TO DB
      let date = new Date()
      let newRecipient = new Recipient({ firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, dateCreated: date, followedUp: false })
      newRecipient.save((err, recipient) => {
        if (err) {
          console.log(err)
        }
        console.log(recipient)
      })
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

// SOCKET.IO
io.on('connection', (socket) => {
  console.log('Server connected to client!')

  socket.on('saveAsset', (data) => {
    console.log(data)
    // DOES NOT SAVE data.type
    let newAsset = new Asset({ header: data.header, subhead: data.subhead, description: data.description, link: data.link })
    newAsset.save((err, asset) => {
      if (err) {
        console.log(err)
      }
      console.log(asset)
    })
  })

  socket.on('editManifest', (data) => {

  })

  socket.on('requestRecipients', () => {
    Recipient.find({}, (err, recipients) => {
      if (err) {
        console.log(err)
      }
      socket.emit('sendingRecipients', { data: recipients })
    })
  })

  socket.on('getAssetList', () => {
    Asset.find({}, (err, assets) => {
      if (err) {
        console.log(err)
      }
      socket.emit('recieveAssetList', { data: assets })
    })
  })

  socket.on('followedUp', (data) => {
    Recipient.findOne({ email: data.email }, (err, recipient) => {
      recipient.followedUp = true
      recipient.save((err, recipient) => {
        if (err) {
          console.log(err)
        }
        socket.emit('recipientFollowUpChanged')
        console.log(recipient)
      })
    })
  })

})

// SERVER LISTENING
var port = process.env.PORT || 3000
server.listen(port, function() {
  console.log('Server running on port ' + port)
})
app.on('error', function() {
  console.log(error)
})
module.exports = app

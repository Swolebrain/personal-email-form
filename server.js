var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');
var ses = require('nodemailer-ses-transport');
var awsCreds = require('./.config.json');
var transporter = nodemailer.createTransport(ses({
    accessKeyId: awsCreds.accesskey,
    secretAccessKey: awsCreds.secret
}));

app.use(function(req,res,next){
  var allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:80',
    'http://www.titanhack.com',
    'http://titanhack.com'
  ];
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) >= -1){
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res){
  if (!req.body || !req.body.subject || !req.body.message || !req.body.email){
    return res.sendStatus(400);
  }
  var mailOptions = {
    from: 'thecodingteacher@gmail.com',
    to: 'thecodingteacher@gmail.com',
    subject: req.body.email+": "+req.body.subject,
    html: req.body.message
  };
  transporter.sendMail(mailOptions, function(err){
    if (err){
      console.log(err);
    }
    res.sendStatus(200);
    console.log("email sent to "+mailOptions.to);
  });
});

app.listen(8001, function(){
  console.log("listening on port 8001");
});

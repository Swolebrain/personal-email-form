var express = require('express');
var app = express;
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

app.get('/', function(req, res){
  var mailOptions = {
    from: 'Thecodingteacher@gmail.com',
    to: 'thecodingteacher@gmail.com',
    subject: 'Test with AWS SES',
    html: `
    <h1>Yo whats up </h1>`
  };
  transporter.sendMail(mailOptions, function(err){
    if (err){
      console.log(err);
    }
    res.sendStatus(200);
  });
});

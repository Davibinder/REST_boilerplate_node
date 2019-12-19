'use strict';

const express = require("express"),
      bodyParser = require("body-parser"),
      passport = require("passport"),
      users = require("./app/routes/api/users"),
      path = require('path');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

//handling CORS Error
app.all('/*', (request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Headers', 'Content-Type, api_key, Authorization, x-requested-with, Total-Count, Total-Pages, Error-Message');
  response.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, OPTIONS');
  response.header('Access-Control-Max-Age', 1800);
  next();
});

// serve static folder.
app.use(express.static(__dirname + '/public'));

// base_path request to test server is working or not.
app.get('/', (req, res) => res.sendStatus(200));

// initialize mongodb 
require('./app/startup/startmongo')();

// Passport middleware and config
app.use(passport.initialize()); 
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);

const port = process.env.PORT || 4000;
const url = process.env.URL || '0.0.0.0'

app.listen(port, url, () => console.log(`Server up and running on url ${url} and port ${port} !`));



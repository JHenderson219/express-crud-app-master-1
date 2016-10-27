var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var router = express.Router();
require('es6-promise').polyfill();
require('isomorphic-fetch');

var port = 8000;

app.use(bodyParser.json()); // supports JSON encoded bodys 
app.use(bodyParser.urlencoded({ // handles multipart JSON
  extended: true
}));

app.use(express.static(__dirname + '/public')); // setting the clients static folder

app.set('view engine', 'ejs'); // optional - using ejs view library
app.set('views', __dirname + '/views/');
app.use(router);

// User routes
router.get('/', function(request, response) {
  /*
    1. First argument is passing the view back to the client
    2. Second argument is our data object to use in the rendered page
  */
  fetch('http://localhost:8000/api/items').then(function(res){
    return res.json();
  }).then(function(json) {
    response.render('pages/index', {
      items: json
    }); // render actual page
  });
});


// API routes
var apiItems = require('./routes/api-items.js');
router.use('/api/items/', apiItems);

app.listen(port, function() {
  console.log('Site listening on port', port);
});
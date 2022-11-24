var express = require('express');
var router = express.Router();
let path = require('path');
let app = express();
app.use('/', express.static('../frontend/src')); // for production, serve static frontend at root
/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express PMS' });
  //res.sendFile( path.resolve('../','frontend', 'src', 'index.html') );
  res.redirect('http://ps19.localhost:3000/');
});

module.exports = router;

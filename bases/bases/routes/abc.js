var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('abc', { title: 'Bases1' });
});

module.exports = router;
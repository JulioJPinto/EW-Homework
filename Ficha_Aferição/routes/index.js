var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.redirect('/pessoas');
});

module.exports = router;

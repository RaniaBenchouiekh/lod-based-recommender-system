var express = require('express');

var router = express.Router();

/* GET React App */
router.get('/', function(req, res, next) {
  res.write('Hello from server ..');
 });

module.exports = router;
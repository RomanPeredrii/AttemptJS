var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});



/* GET enter page. */
router.get('/enter', function (req, res, next) {
  res.render('enter', { title: 'Enter' });
});

/* GET enter-init page. */
router.get('/enter-init', function (req, res, next) {
  try {
    console.log(req.query);
    let name = req.query.name;
    res.render('enter-init', { title: '/Enter' });
  } catch (error) {
    res.render('error', { message: 'uncorrect query' });
  }

});

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({
        title: 'API description',
        example1: 'api/example1',
        example2: 'api/example2',
    });
});

module.exports = router;

let express = require('express');
let mainController = require('../controllers/MainController');
var router = express.Router();

router.post('/people', mainController.people);
router.post('/planets', mainController.planets);

module.exports = router;

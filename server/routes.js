const express = require('express');
const router = express.Router();

//Define separate controller for each module
const mathController = require('./controllers/math');
const aviationController = require('./controllers/aviation');
const locationController = require('./controllers/location');

//const KloudspotInsights = require('/Users/uday/jamesonworkspace/kloudspot-analytics-node-sdk/lib/KloudspotInsights');
const KloudspotInsights = require('kloudspot-analytics-node-sdk');

const ksClient = new KloudspotInsights({
    'host': 'https://walker.kloudspot.com/advanced',
	'id': '65dd0ddfaa2aaf7c357f38b8',
	'secretKey': '6bd17e8ce0a11032'
});

//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Request received at => : ', Date.now());
  req.ksClient = ksClient;
  next();
});

//All routes can be defined here. 
router.get('/math/check/:num', mathController.checkEven);

router.get('/aviation/bookloads', aviationController.bookloads);

router.get('/location/sites', locationController.sites);

module.exports = router;

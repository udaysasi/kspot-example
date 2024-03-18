const express = require('express');
const router = express.Router();

//Define separate controller for each module
const mathController = require('./controllers/math');
const aviationController = require('./controllers/aviation');

//const KloudspotInsights = require('/Users/uday/jamesonworkspace/kloudspot-analytics-node-sdk/lib/KloudspotInsights');
const KloudspotInsights = require('kloudspot-analytics-node-sdk');

const ksClient = new KloudspotInsights({
    'host': 'https://gmr-dev.kloudspot.com:8443/advanced',
	'id': '65dd775d1589a713d5228a57',
	'secretKey': '566523523e5dcb72'
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

module.exports = router;

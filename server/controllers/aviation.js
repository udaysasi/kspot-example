const moment = require('moment');

exports.bookloads = (req, res, next) => {
	
	req.ksClient.airport.bookloads({"startTime": moment().subtract(1, "days").valueOf(), "finishTime": moment().valueOf()}).then(function(response) {
	    if(response && Array.isArray(response)) {
	        res.status(200).json({
				data: response,
				error: false
			});
	    } else {
	        console.log(response);
	    }
	});

};

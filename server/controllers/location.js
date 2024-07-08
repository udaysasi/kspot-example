const moment = require('moment');

exports.sites = (req, res, next) => {
	
	req.ksClient.siteHierarchy.sites().then(function(response) {
		//console.log(response);
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

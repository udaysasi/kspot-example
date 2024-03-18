const axios = require('axios');

exports.checkEven = (req, res, next) => {
	const num = req.params.num;
	axios.get('https://api.isevenapi.xyz/api/iseven/' + num)
		.then(response => {
			console.log(response.data);
			res.status(200).json({
				data: response.data.iseven,
				error: false
			});
		})
		.catch(error => {
			console.log(error);
			res.status(500).json({
				data: null,
				error: true
			});
		});

};

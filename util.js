module.exports.validateJWTBody = function (body, props) {
	const errors = [];
	for (prop of props) {
		if (!body[props]) errors.push(`${prop} not found in token body`);
	}
	if (errors.length > 0) {
		return { status: 400, messages: errors };
	} else {
		return false;
	}
}
module.exports.wrapRoute = fn => {
	return async (req, res, next) => {
		try {
			await fn(req, res, next)
		} catch (err) {
			next(err);
		}
	};
};
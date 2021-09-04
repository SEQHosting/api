const jwt = require('jsonwebtoken');
const config = require('./config');
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
module.exports.validateJWT = (req, res, next) => {
	jwt.verify(req.body.token, config.jwtSecret, (err, decoded) => {
		if (err) throw err;
		const validation = module.exports.validateJWTBody(decoded, ['username']);
		if (validation) throw validation;
    req.jwtBody = decoded;
		next();
	});
};
module.exports.validateBody = (req, res, next) => {
  const validation = req.validate();
  if (validation) throw validation;
  next();
}
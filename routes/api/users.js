const router = require('express').Router();
const User = require('mongoose').model('User');
const { body } = require('express-validator');
const config = require.main.require('./config');
const { validateJWTBody, wrapRoute, validateBody } = require.main.require('./util');
const jwt = require('jsonwebtoken');
router.post('/login', 
	body('username').not().isEmpty().withMessage('Username must not be empty'),
	body('password').not().isEmpty().withMessage('Password must not be empty'),
  validateBody,
	wrapRoute(async (req, res, next) => {
		const user = await User.findOne({ username: req.body.username });
		if (!user) return next({status:404, message:'No such user'});
		if (await user.validatePassword(req.body.password)) {
			res.json({token: user.generateJWT()})
		} else {
			return next({status:403, message:'Invalid password'});
		}
}));
router.post('/signup', 
	body('username').not().isEmpty().withMessage('Username must not be empty'),
	body('password').not().isEmpty().withMessage('Password must not be empty'),
  validateBody,
	wrapRoute(async (req, res, next) => {
		const user = new User({ username: req.body.username })
		await user.setPassword(req.body.password);
		await user.save();
		res.json({success:true});
}));
router.post('/changePassword', 
	body('token').not().isEmpty().withMessage('Token must not be empty'),
	body('oldPassword').not().isEmpty().withMessage('Old password must not be empty'),
	body('newPassword').not().isEmpty().withMessage('New password must not be empty'),
  validateBody,
	wrapRoute(async (req, res, next) => {
		jwt.verify(req.body.token, config.jwtSecret, async (err, decoded) => {
			if (err) return next(err);
			const jwtValidation = validateJWTBody(decoded, ['username']);
			console.log(jwtValidation)
			if (jwtValidation) return next(err);
			const user = await User.findOne({ username: decoded.username });
			if (!(await user.validatePassword(req.body.oldPassword))) return next({status:403, message:'Invalid old password'});
			await user.setPassword(req.body.newPassword);
			await user.save();
			res.json({success:true});
		});
}));
module.exports = router;
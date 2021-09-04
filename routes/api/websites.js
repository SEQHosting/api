const router = require('express').Router();
const { validateJWT, validateBody, wrapRoute } = require.main.require('./util');
const { body } = require('express-validator');
const Website = require('mongoose').model('Website');
router.use((req, res, next) => {
	if (!req.body.token) throw { status: 400, message: 'Token not provided' };
	validateJWT(req, res, next);
  //const validation = req.validate();
});
router.post('/', 
	body('name').not().isEmpty().withMessage('Website name must be provided').matches(/[a-zA-Z0-9_\-]/).withMessage('Website name must only contain alphanumeric characters, numberers, dashes, or underscores').isLength({ min: 1, max: 63 }).withMessage('Website name must be 1-63 characters in length'),
  validateBody,
  wrapRoute(async (req, res, next) => {
    const website = new Website({ name: req.body.name, owner: req.jwtBody.username, files: [] });
    await website.save();
    res.json({success:true});
  }));
module.exports = router;
const router = require('express').Router();
router.use('/users', require('./users'));
router.use('/websites', require('./websites'));
module.exports = router;
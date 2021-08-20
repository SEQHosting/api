const router = require('express').Router();
router.use(require('./api'));
router.get('/', (req, res) => {
	//res.redirect('https://seqhosting.tk');
	res.json({status:'OK'})
});
module.exports = router;

const express = require('express');
const app = express();
const { validationResult } = require('express-validator');

const config = require('./config');
const mongoose = require('mongoose');
mongoose.connect(config.mongodbUrl, { 
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
  useCreateIndex: true 
});
require('./models/User');

app.use(express.json());
app.use((req, res, next) => {
	req.validate = () => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const messages = errors.array().map(item => item.msg);
			return { status: 400, messages };
		} else {
			return false;
		}
	};
	next();
});
app.use(require('./routes'));
app.use((err, req, res, next) => {
	res.status(err.status || 500).send({
		errors: err.messages || [err.message]
	});
});

app.listen(8080, () => {
  console.log('server started');
});

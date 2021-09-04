const mongoose = require('mongoose');
//const User = require('./User');
const uniqueValidator = require('mongoose-unique-validator');
const mime = require('mime-db');
const WebsiteSchema = new mongoose.Schema({
	name: {type: String, required: [true, "can't be blank"], unique: true},
	//owner: User,
	owner: {type: String, required: [true, "can't be blank"]},
	files: {
    type: [{
      name: String,
      content: String
	  }],
    validate: v => Array.isArray(v)
  }
});
WebsiteSchema.plugin(uniqueValidator, {message: 'is already taken.'});
WebsiteSchema.methods.read = function (file) {
	return (this.files.find(item => item.name === file)||{content:null}).content;
};
WebsiteSchema.methods.write = function (file, contents) {
	const index = this.files.findIndex(item => item.name === file);
	if (index !== -1) this.files[index].content = contents;
	else this.files.push({name: file, content: contents});
};
WebsiteSchema.methods.delete = function (file) {
  const index = this.files.findIndex(item => item.name === file);
  this.files.splice(index, 1);
}
WebsiteSchema.methods.serve = function (path) {
	const tryOr404 = path => {
		const contents = this.read(path);
		if (contents === null) return { status: 404, type: 'text/html', content: '<h1>404 Not Found</h1>'};
		else return { status: 200, type: mime.contentType(path), content: contents};
	}
	if (path === '/') {
		return tryOr404('index.html');
	} else {
		return tryOr404(path.slice(1));
	}
}
module.exports = mongoose.model('Website', WebsiteSchema);
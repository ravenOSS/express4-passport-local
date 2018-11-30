let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');

let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  key: { type: String },
  totp_active: { type: Boolean, default: false }
});

// generating a hashed password
userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
};

// Note that validPassword is used in passport
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', userSchema);

module.exports = User;

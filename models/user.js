let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let SALT_FACTOR = 12;

let userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  key: { type: String },
  totp_active: { type: Boolean, default: false }
});

var noop = function () {};

userSchema.pre('save', function (done) {
  var user = this;
  if (!user.isModified('password')) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
      if (err) { return done(err); }
      user.password = hashedPassword;
      done();
    });
  });
});

userSchema.methods.checkPassword = function (guess, done) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    done(err, isMatch);
  });
};

userSchema.methods.name = function () {
  return this.displayName || this.username;
};

var User = mongoose.model('User', userSchema);

module.exports = User;

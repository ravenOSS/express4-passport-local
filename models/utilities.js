/**
*Module dependencies
*/
var UserModel = require('./users');
//= =============================================================================
/**
*User Model Utility functions
*/
function errHandler (err) {
  console.error('There was an error performing the operation');
  console.log(err);
  console.log(err.code);
  return console.error(err.message);
}

function validationErr (err, res) {
  Object.keys(err.errors).forEach(function (k) {
    var msg = err.errors[k].message;
    console.error('Validation error for \'%s' + ': %s', k, msg);
    return res.status(404).json({
      msg: 'Please ensure required fields are filled'});
  });
}

function viewAllUsers (req, res) {
  return UserModel.find({},
    function (err, users) {
      if (err) {
        return errHandler(err);
      }
      console.log(users);
      return res.json(users);
    });
}

function updateUser (req, res) {
  return UserModel.findOne({email: req.params.email},
    function (err, user) {
      if (err) {
        return errHandler(err);
      }
      console.log(user);
      user.email = req.body.email;
      user.password = req.body.password;
      user.save(function (err, user) {
        if (err) {
          return errHandler(err);
        }
        console.log('User updated: ', user);
        return res.json(user);
      });
    });
}

function deleteUser (req, res) {
  return UserModel.findOneAndRemove({email: req.params.email},
    function (err, user) {
      if (err) {
        return errHandler(err);
      }
      console.log('User deleted ', user);
      return res.json(user);
    });
}
//= =============================================================================
/**
* Export module
*/
module.exports = {
  errHandler: errHandler,
  validationErr: validationErr,
  viewAllUsers: viewAllUsers,
  updateUser: updateUser,
  deleteUser: deleteUser
};
//= =============================================================================

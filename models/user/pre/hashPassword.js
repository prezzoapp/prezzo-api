/* ==========================================================================
   Local variables, module dependencies
   ========================================================================== */

var

  /** bcrypt lib */
  bcrypt = require('bcrypt'),

  /** bcrypt salt strength */
  SALT_WORK_FACTOR = 10;

/* ==========================================================================
   Exports - middleware type & function
   ========================================================================== */

module.exports = {
  name: 'save',
  run: function(next) {
    var user = this;

    if (!user.isModified('password')) {
      return next();
    }

    return bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      return bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        return next();
      });
    });
  },
};
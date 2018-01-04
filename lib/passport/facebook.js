const FacebookStrategy = require('passport-facebook')

function callback (_accessToken, _refreshToken, profile, done) {
  done('secret')
}

const strategy = new FacebookStrategy({
  clientID: id,
  clientSecret: secret,
  callbackURL: 'http://localhost:3050/auth/facebook/callback',
  profileFields: ['email', 'first_name', 'last_name', 'gender'],
  scope: ['email']  // passport-facebook documentation doesn't seem to define this, but it's needed for facebook api.
}, callback)

module.exports = strategy

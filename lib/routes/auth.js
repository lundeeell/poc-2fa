const auth = require('../services/auth')
const users = require('../services/users')

const login = (req, res) =>
  auth
    .attempt(req.body.username, req.body.password)
    .then(user => res.json({ userId: user.id }))
    .catch(() => res.status(401).json({ error: 'Invalid credentials' }))

const register = (req, res) =>
  users
    .create(req.body.username, req.body.password)
    .then(user => {
      res.json({ success: true, userId: user.id })
    })

const setupTwoFactorAuth = (req, res) =>
  req.body.method === 'sms'
    ? setupTwoFactorAuthWithSMS(req, res)
    : setupTwoFactorAuthWithTOTP(req, res)

const validateTwoFactorToken = (req, res) =>
  req.body.method === 'sms'
    ? validateTwoFactorSMS(req, res)
    : validateTwoFactorTOTP(req, res)

const setupTwoFactorAuthWithTOTP = ({ body: { userId } }, res) =>
  auth
    .createTwoFactorQRCode(userId)
    .then(qr => res.json({ qr, userId }))

const setupTwoFactorAuthWithSMS = ({ body: { userId, phoneNumber } }, res) => {
  auth
    .sendTwoFactorSMS(userId, phoneNumber)
    .then(() => res.json({ phoneNumber }))
}

const validateTwoFactorTOTP = (req, res) => {
  auth
    .verifyTOTP(req.body.userId, req.body.token)
    .then(success => success
      ? res.json({ success: true })
      : res.status(401).json({ error: 'Could not validate two factor token' }))
}

const validateTwoFactorSMS = (req, res) => {
  auth
    .verifyOneTimePassword(req.body.userId, req.body.token)
    .then(success => success
      ? res.json({ success: true })
      : res.status(401).json({ error: 'Could not validate two factor token' }))
}

module.exports = {
  login,
  register,
  setupTwoFactorAuth,
  validateTwoFactorToken
}
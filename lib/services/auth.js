const bcrypt = require('./bcrypt')
const qr = require('./qr')
const speakeasy = require('speakeasy')
const tap = require('../util/tap')
const users = require('./users')
const sms = require('./sms')
const oneTimeCodes = require('./oneTimeCodes')
const { formatPhoneNumber } = require('../util/phone')

const attempt = (username, password) =>
  users
    .findByUsername(username)
    .then(user =>
      bcrypt.validate(password, user.password)
        .then(() => user)
    )
    .then(sendTwoFactorPassword)

const sendTwoFactorPassword = user => {
  if (user && user.phone_number) {
    sendTwoFactorSMS(user.id, user.phone_number)
  }

  return user
}

const buildMessage = code => `Your one time password is ${code}`

const createTwoFactorQRCode = async (userId) => {
  const secret = speakeasy.generateSecret()
  users.saveTwoFactorSecret(userId, secret.base32)

  return await qr.generateQRCodeImage(secret.otpauth_url)
}

const sendTwoFactorSMS = (userId, number) => {
  users.savePhoneNumber(userId, number)
  return oneTimeCodes.generate(userId)
    .then(code => {
      sms.send(formatPhoneNumber(number), buildMessage(code))
    })
}

const verifyOneTimePassword = (userId, token) =>
  oneTimeCodes
    .findCodeFor(userId)
    .then(code => oneTimeCodes.verify(code, token))
    .catch(err => false)

const verifyTOTP = (userId, token) =>
  users
    .find(userId)
    .then(({ two_factor_enabled, two_factor_secret: secret }) => {
      if (!secret) return verifyOneTimePassword(userId, token)

      return tap(speakeasy.totp.verify({ secret, token, encoding: 'base32' }), success => {
        if (success && !two_factor_enabled) users.enableTwoFactorAuthentication(userId)
      })
    })

module.exports = {
  attempt,
  createTwoFactorQRCode,
  sendTwoFactorSMS,
  verifyOneTimePassword,
  verifyTOTP,
}
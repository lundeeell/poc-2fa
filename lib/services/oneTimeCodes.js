const db = require('../adapters/db')
const random = require('./random')

const FIVE_MINUTES = 5 * 60 * 1000

const findCodeFor = userId =>
  db.one(`SELECT * FROM one_time_passwords WHERE username = $1`, [userId])

const generate = userId =>
  db.del('one_time_passwords', { username: userId})
    .then(() => random.digits(6))
    .then(code => {
      db.insert('one_time_passwords', {
        username: userId,
        code,
        valid_until: new Date(Date.now() + FIVE_MINUTES)
      })

      return code
    })

const hasNotYetExpired = oneTimeCode =>
  new Date() < new Date(oneTimeCode.valid_until)

const verify = (oneTimeCode, token) =>
  String(oneTimeCode.code) === String(token) && hasNotYetExpired(oneTimeCode)

module.exports = {
  findCodeFor,
  generate,
  verify,
}
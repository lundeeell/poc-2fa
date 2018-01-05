const bcrypt = require('./bcrypt')
const db = require('../adapters/db')

const create = (username, password) =>
  bcrypt
    .hash(password)
    .then(password => db.insert('users', { username, password }))

const findByColumn = column => id =>
  db.one(`SELECT * from users WHERE ${column} = $1`, [id])

const find = findByColumn('id')

const findByUsername = findByColumn('username')

const enableTwoFactorAuthentication = id =>
  db.update('users', { id, two_factor_enabled: true })

const saveTwoFactorSecret = (id, secret) =>
  db.update('users', { id, two_factor_secret: secret })

const savePhoneNumber = (id, phoneNumber) =>
  db.update('users', { id, phone_number: phoneNumber })

module.exports = {
  create,
  enableTwoFactorAuthentication,
  find,
  findByUsername,
  saveTwoFactorSecret,
  savePhoneNumber
}
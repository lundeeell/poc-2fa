const bcrypt = require('bcrypt')

const hash = password => new Promise((resolve, reject) => {
  bcrypt.hash(password, 10, function (err, hash) {
    if (err) reject(err)

    resolve(hash)
  })
})

const validate = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, res) => {
    if (err) reject(err)
    if (!res) reject(res)

    resolve(res)
  })
})

module.exports = {
  hash,
  validate
}
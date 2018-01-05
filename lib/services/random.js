const randomize = require('randomatic')

const digits = (length = 10) => Promise.resolve(randomize('0', length))

module.exports = {
  digits
}
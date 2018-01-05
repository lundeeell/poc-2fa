const formatPhoneNumber = number =>
  '+46' + (
    String(number)
    .replace('+46', '')
    .replace(/^0046/, '')
    .trimLeft('0')
  )

module.exports = {
  formatPhoneNumber
}
const QRCode = require('qrcode')

const generateQRCodeImage = string => new Promise((resolve, reject) => {
  QRCode.toDataURL(string, function (err, qr) {
    if (err) reject(err)

    resolve(qr)
  })
})

module.exports = {
  generateQRCodeImage
}
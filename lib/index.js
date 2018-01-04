const express = require('express')
const passport = require('passport')
const app = express()
const facebookStrategy = require('./passport/facebook')
const QRCode = require('qrcode')
const userService = require('./services/user')

passport.use(facebookStrategy)

app.get('/auth/facebook',
  passport.authenticate('facebook', { session: false }
))

app.get('/auth/facebook/callback', () => {

})

app.post('/auth/token')

app.post('/auth/setup', (req, res) => {
  const userId = req.body.userId
  const secret = speakeasy.generateSecret()



  QRCode.toDataURL(secret.otpauth_url, function (err, image_data) {
    res.json({
      qr: image_data,
      userId
    })
  })
})

app.post('/auth/validate', () => {

})

app.listen(3050)

require('dotenv').config()

const express = require('express')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors')
const facebookStrategy = require('./passport/facebook')
const auth = require('./routes/auth')

const app = express()

app.use(bodyParser.json())
app.use(cors())
passport.use(facebookStrategy)

app.get('/auth/facebook', passport.authenticate('facebook', { session: false }))
app.get('/auth/facebook/callback', () => {})

app.post('/login', auth.login)
app.post('/register', auth.register)
app.post('/auth/token', auth.validateTwoFactorToken)
app.post('/auth/setup', auth.setupTwoFactorAuth)
app.post('/auth/validate', auth.validateTwoFactorToken)

app.listen(3050, () => console.log('Running on port 3050'))

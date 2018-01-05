const Twilio = require('twilio');

const { TWILIO_ID, TWILIO_SECRET, TWILIO_NUMBER } = process.env
const client = new Twilio(TWILIO_ID, TWILIO_SECRET);

const send = (to, body) => client.messages.create({
  body,
  to,
  from: TWILIO_NUMBER
})

module.exports = {
  send
}
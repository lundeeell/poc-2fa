#!/usr/bin/env node
'use strict'

const pg = require('pg')
const {
  database: {
    user,
    password,
    database,
    host,
    port,
    timeout
  }
} = require('../lib/config')

const client = new pg.Client({
  database,
  user,
  password,
  host,
  port
})

function checkAlive () {
  return new Promise((resolve, reject) => {
    client.once('error', err => {
      process.stdout.write(`${err}\n`)
    })

    connect(resolve, reject)
  })
}

function connect (resolve, reject) {
  client.connect(err => {
    if (err) {
      setTimeout(() => connect(resolve), 5000)
    } else {
      client.end(err => {
        if (err) {
          process.stdout.write(`${err}\n`)
          return reject(err)
        }
        resolve()
      })
    }
  })
}

function timeoutDb () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      process.stdout.write(`Timeout\n`)
      reject('Timeout')
    }, timeout)
  })
}

function start () {
  return Promise
    .race([
      checkAlive(),
      timeoutDb()
    ])
    .then(() => {
      process.exitCode = 0
    })
    .catch(err => {
      process.exitCode = 1
    })
    .then(() =>
      process.exit(process.exitCode))
}

return start()


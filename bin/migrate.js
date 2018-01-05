#!/usr/bin/env node
'use strict'

const { database: { user, password, database, host } } = require('../lib/config')
const { spawn } = require('child_process')
const cwd = `${process.cwd()}`.replace(/\/bin(\/)?$/i, '')

const env = Object.assign({}, process.env, {
  DATABASE_URL: `postgres://${user}:${password}@${host}/${database}`,
})

const checkDB = spawn('npm', ['run', '-s', 'checkdb'], {
  cwd, env
})

checkDB.stdout.on('data', data => console.log(`${data}`))
checkDB.stderr.on('data', data => console.error(`${data}`))

checkDB.on('close', code => {
  if (`${code}` !== '0') {
    return process.exit(code)
  }

  // Default to migrate up or pass in arguments
  const args = process.argv.slice(2).length ? process.argv.slice(2) : ['up']

  const migrate = spawn('node_modules/.bin/pg-migrate', args, {
    cwd, env
  })

  migrate.stdout.on('data', data => console.log(`${data}`))
  migrate.stderr.on('data', data => console.error(`${data}`))

  migrate.on('close', code => {
    process.exit(code)
  })
})

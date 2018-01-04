exports.up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  pgm.createTable('users', {
    id: {type: 'uuid', default: pgm.func('uuid_generate_v4()'), primaryKey: true, notNull: true},
    username: { type: 'text', notNull: true },
    password: { type: 'text', notNull: true },
    salt: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', notNull: true, default: pgm.func('NOW()') },
    secret: { type: 'text', notNull: false },
    phone: { type: 'number', notNull: false },
    two_factor_enabled: { type: 'boolean', notNull: true, default: false }
  })
}

exports.down = (pgm) => {
  pgm.dropTable('users')
}

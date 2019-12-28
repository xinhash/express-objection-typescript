import Knex from 'knex'

export = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'node_starter',
      user: 'admin',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/app/config/db/migrations'
    },
    seeds: {
      directory: __dirname + '/app/config/db/seeds'
    },
    debug: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'node_starter_staging',
      user: 'admin',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/app/config/db/migrations'
    },
    seeds: {
      directory: __dirname + '/app/config/db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'node_starter',
      user: 'admin',
      password: ''
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/app/config/db/migrations'
    },
    seeds: {
      directory: __dirname + '/app/config/db/seeds'
    }
  }
} as Knex.Config

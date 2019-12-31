import Knex from 'knex'
// import camelcaseKeys from 'camelcase-keys'

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
      directory: __dirname + '/src/config/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/config/db/seeds'
    },
    debug: true
    // postProcessResponse: (result, _) => {
    //   if (Array.isArray(result)) {
    //     return result.map(row => camelcaseKeys(row, { deep: true }))
    //   } else {
    //     return camelcaseKeys(result, { deep: true })
    //   }
    // }
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
      directory: __dirname + '/src/config/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/config/db/seeds'
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
      directory: __dirname + '/src/config/db/migrations'
    },
    seeds: {
      directory: __dirname + '/src/config/db/seeds'
    }
  }
} as Knex.Config

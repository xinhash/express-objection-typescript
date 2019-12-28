import moduleAlias from 'module-alias'
moduleAlias.addAlias('@app', __dirname)

import { config } from 'dotenv'
config()
import { setupDB } from '@app/config/db/commands'
import server from '@app/server'
import { NODE_ENV } from '@app/typings/shared'
const port = process.env.SERVER_PORT || 8080

setupDB(process.env.NODE_ENV as NODE_ENV)

// start the express server
server.listen(port, async () => {
  if (process.env.NODE_ENV !== 'production') {
    const listEndpoints = await import('express-list-endpoints')
    console.log(listEndpoints.default(server))
  }
  console.log(`server started at http://localhost:${port}`)
})

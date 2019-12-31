import moduleAlias from 'module-alias'
moduleAlias.addAlias('@app', __dirname)

import { config } from 'dotenv'
config()
import { setupDB } from '@app/config/db/commands'
import server from '@app/server'
import { NODE_ENV } from '@app/types/common'
const port = process.env.SERVER_PORT || 8080

setupDB(process.env.NODE_ENV as NODE_ENV)

// start the express server
server.listen(port, async () => {
  console.log(`server started at http://localhost:${port}`)
})

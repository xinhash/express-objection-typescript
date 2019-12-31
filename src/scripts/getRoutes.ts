import server from '@app/server'

function getRoutes() {
  const routes = server._router.stack
    .filter(middleware => {
      if (String(middleware.regexp).includes('/graphql')) {
        return true
      }
      return middleware.route
    })
    .map(middleware => {
      if (String(middleware.regexp).includes('/graphql')) {
        return `get -> /graphql`
      }
      return `${Object.keys(middleware.route.methods).join(', ')} -> ${
        middleware.route.path
      }`
    })

  console.log(JSON.stringify(routes, null, 4))
}

getRoutes()

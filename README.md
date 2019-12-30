# express-objection-typescript

### Packages Used

1. Express JS
2. Object Js
3. Knex
4. pg
5. Jest

### How to run the project

```js
cd /project
mv .env.example .env
createdb sample_db // postgres. You may need to modify knexfile.ts if using other database
yarn serve // runs development server
yarn build && yarn start // runs production serve
yarn test // runs jest
```

### Feature

- [x] TS compilation
- [x] DB Connection
- [x] Auth: Register user, Login user
- [x] Configure Test suite
- [x] Rest API playground
- [x] RBAC (Role based access control)
- [x] Graphql

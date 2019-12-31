import { GraphQLObjectType, GraphQLList } from 'graphql'
import { builder } from 'objection-graphql'
import User from '@app/features/user/user.model'
import forOwn from 'lodash/forOwn'

const graphQlSchema = builder()
  .model(User)
  .argFactory((fields, modelClass) => {
    const args = {}
    forOwn(fields, (field, propName) => {
      // Skip all non primitive fields.
      if (
        field.type instanceof GraphQLObjectType ||
        field.type instanceof GraphQLList
      ) {
        return
      }

      args[propName + 'NotEq'] = {
        // For our filter the type of the value needs to be
        // the same as the type of the field.
        type: field.type,

        query: (query, value) => {
          // query is an objection.js QueryBuilder instance.
          query.where(propName, '<>', value)
        }
      }
    })

    return args
  })
  .build()

export default graphQlSchema

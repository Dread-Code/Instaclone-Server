const { gql } = require('apollo-server')

const typeDefs = gql`
    type User {
        id: ID
        name: String
        username: String
        email: String
        siteWeb: String
        description: String
        password: String
        avatar: String
        createdAt: String
    }

    type Token {
        token: String
    }

    input UserInput {
        name: String! 
        username: String!
        email: String!
        password: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    type Query {
        # User 
        getUser(id: ID, username: String): User
    }

    type Mutation {
        # User 
        register(input: UserInput): User
        login(input: LoginInput): Token
    }
`

module.exports = typeDefs
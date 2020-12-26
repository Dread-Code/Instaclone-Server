const userController = require('../controllers/user')

const resolver = {
    Query:{
        // Users
        getUser: () => {
            console.log('Obteniendo Usuario')
            return null
        },
    },
    Mutation:{
        //User
        register: (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input),
    }
}

module.exports = resolver
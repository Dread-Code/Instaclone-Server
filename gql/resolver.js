const userController = require('../controllers/user')

const resolver = {
    Query:{
        // Users
        getUser: (_, { id, username } ) => userController.getUser(id, username)
        ,
    },
    Mutation:{
        //User
        register: (_, { input }) => userController.register(input),
        login: (_, { input }) => userController.login(input),
        updateAvatar: (_, { file }, ctx) => userController.updateAvatar(file, ctx),
        deleteAvatar: (_, {}, ctx) => userController.deleteAvatar(ctx),
    }
}

module.exports = resolver
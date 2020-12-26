const User = require('../models/User');
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")


function createToken(user, SECRET_KEY, expiresIn){
    const { id, name, email, username } = user
    const payLoad = {
        id,
        name,
        email,
        username
    }
    return jwt.sign(payLoad, SECRET_KEY, { expiresIn })

}

async function register(input) {
    const newUser = input
    newUser.email = input.email.toLowerCase()
    newUser.username = input.username.toLowerCase()

    const { email, username, password } = newUser

    // Revisamos si el  email esta en uso
    const foundEmail = await User.findOne({ email })
    if (foundEmail) throw new Error('Email already exists')

    // Revisamos si el username esta en uso
    const foundUsername = await User.findOne({ username })
    if (foundUsername) throw new Error('Username already exists')

    //Encriptar
    const salt = await bcryptjs.genSaltSync(10)
    newUser.password = await bcryptjs.hash(password, salt)
    try {
        const user = new User(newUser)
        user.save()
        return user
    } catch (error) {
        console.log(error)
    }
}

async function login(input) {
    const { email, password } = input

    const userFound = await User.findOne({ email: email.toLowerCase() })
    if (!userFound) throw new Error("Error en el email o contraseña")

    const passwordSuccess = await bcryptjs.compare(password, userFound.password)
    if (!passwordSuccess) throw new Error("Error en el password o contraseña")

    return {
        token: createToken(userFound, process.env.SECRET_KEY, "24h")
    }
}

module.exports = {
    register,
    login
}
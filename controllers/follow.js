const Follow = require("../models/follow");
const User = require("../models/user");
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken")

async function follow(username, ctx) {

    const userFound = await User.findOne({ username})
    if (!userFound) throw new Error("Usuario no encontrado")

    try {
        const follow = await Follow({
            idUser: ctx.user.id,
            follow: userFound._id
        })
        follow.save()
        return true
    } catch (error) {
        console.log(error)
        return false
    }
}

async function isFollow(username, ctx) {
    const userFound = await User.findOne({ username})
    if (!userFound) throw new Error("Usuario no encontrado")
    
    const follow = await Follow.find({ idUser: ctx.user.id })
    .where("follow")
    .equals(userFound._id)

    if(follow.length > 0){
        return true
    }
    return false
}

async function unFollow(username, ctx){
    const userFound = await User.findOne({ username})
    if (!userFound) throw new Error("Usuario no encontrado")

    const unFollow = await Follow.findOneAndDelete({ idUser: ctx.user.id })
    .where("follow")
    .equals(userFound._id)

    if (unFollow) {
        return true
    }

    return false
}

async function getFollowers(username){

    const { _id } = await User.findOne({ username })
    const followers = await Follow.find({follow: _id}).populate("idUser")

    const followersList = []

    for await (const data of followers) {
        followersList.push(data.idUser)
    }


    return followersList;
}

module.exports = {
    follow,
    isFollow,
    unFollow,
    getFollowers,
}
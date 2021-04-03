const Follow = require("../models/follow");
const User = require("../models/user");

async function follow(username, ctx, pubSub, NEW_FOLLOWER) {

    const userFound = await User.findOne({ username})
    if (!userFound) throw new Error("Usuario no encontrado")

    try {
        const follow = await Follow({
            idUser: ctx.user.id,
            follow: userFound._id
        })
        follow.save()
        const followers = await getFollowers(userFound.username)
        pubSub.publish(NEW_FOLLOWER, {newFollower: followers })
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

async function unFollow(username, ctx, pubSub, NEW_FOLLOWER){
    const userFound = await User.findOne({ username})
    if (!userFound) throw new Error("Usuario no encontrado")

    const unFollow = await Follow.findOneAndDelete({ idUser: ctx.user.id })
    .where("follow")
    .equals(userFound._id)

    if (unFollow) {
        const followers = await getFollowers(userFound.username)
        pubSub.publish(NEW_FOLLOWER, {newFollower: followers })
        return true
    }

    return false
}

async function getFollowers(username){
    const { _id } = await User.findOne({ username })
    const followers = await Follow.find({follow: _id}).populate("idUser")
    let followersList = []
    
    if(followers.length === 0){
        return{follow: username}
    } else {
        
        for await (const data of followers) {
            followersList.push(data.idUser)
        }
        return { followers: followersList, follow: username};
    }

}

async function getFollows( username ) {
    const { _id } = await User.findOne({ username })
    const follows = await Follow.find({idUser: _id}).populate("follow")

    let followsArray = []

    for await (const data of follows){
        followsArray.push(data.follow)
    }

    return followsArray

}

module.exports = {
    follow,
    isFollow,
    unFollow,
    getFollowers,
    getFollows,
}
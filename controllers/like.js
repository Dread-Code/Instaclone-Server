const Like = require("../models/like");
const { NEW_LIKE } = require("../gql/tags");

async function addLike(idPublication, ctx, pubSub) {
  try {
    const like = new Like({
      idPublication,
      idUser: ctx.user.id,
    });
    pubSub.publish(NEW_LIKE, { newLike: { like: 1, idPublication } });
    like.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteLike(idPublication, ctx, pubSub) {
  try {
    await Like.findOneAndDelete({ idPublication })
      .where("idUser")
      .equals(ctx.user.id);
    pubSub.publish(NEW_LIKE, { newLike: { like: -1, idPublication } });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function isLike(idPublication, ctx) {
  try {
    const result = await Like.findOne({ idPublication })
      .where("idUser")
      .equals(ctx.user.id);
    if (!result) return false;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function countLikes(idPublication) {
  try {
    const result = await Like.countDocuments({ idPublication });

    return result;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addLike,
  deleteLike,
  isLike,
  countLikes,
};

const Like = require("../models/like");

async function addLike(idPublication, ctx) {
  try {
    const like = new Like({
      idPublication,
      idUser: ctx.user.id,
    });

    like.save();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function deleteLike(idPublication, ctx) {
  try {
    await Like.findOneAndDelete({ idPublication })
      .where("idUser")
      .equals(ctx.user.id);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  addLike,
  deleteLike,
};

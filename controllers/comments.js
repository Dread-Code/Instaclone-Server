const { NEW_COMMENT } = require("../gql/tags");
const Comment = require("../models/comments");

async function addComment(
  { idPublication, comment: commentInput },
  { user },
  pubSub
) {
  try {
    const comment = new Comment({
      idPublication,
      idUser: user.id,
      comment: commentInput,
    });

    comment.save();
    const comments = await getComments(idPublication);
    pubSub.publish(NEW_COMMENT, { newComment: comments });
    return comment;
  } catch (e) {
    console.log(e);
  }
}

async function getComments(id) {
  let comments = await Comment.find({ idPublication: id })
    .sort({
      createdAt: -1,
    })
    .populate("idUser");
  return comments;
}

module.exports = {
  addComment,
  getComments,
};

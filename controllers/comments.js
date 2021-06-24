const Comment = require("../models/comments");

async function addComment({ idPublication, comment: commentInput }, { user }) {
  try {
    const comment = new Comment({
      idPublication,
      idUser: user.id,
      comment: commentInput,
    });

    comment.save();
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

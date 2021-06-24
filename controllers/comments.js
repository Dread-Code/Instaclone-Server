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

module.exports = {
  addComment,
};

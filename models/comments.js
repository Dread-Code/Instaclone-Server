const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema({
  idPublication: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Publication",
  },
  idUser: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "User",
  },
  comment: {
    type: String,
    trim: true,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Comment", CommentSchema);

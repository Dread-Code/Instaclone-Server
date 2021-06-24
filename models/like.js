const { Schema, model } = require("mongoose");

const LikeSchema = Schema({
  idPublication: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Publication",
  },
  idUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = model("Like", LikeSchema);

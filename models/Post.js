const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  comments: [
    {
      text: String,
      commentedBy: {
        type: ObjectId,
        ref: "User",
      },
    },
  ],
  likes: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = model("Post", postSchema);

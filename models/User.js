const { Schema, model } = require("mongoose");
const { ObjectId } = Schema.Types;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  password: {
    type: String,
    reuqired: true,
  },
  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/dq5hzxrm7/image/upload/v1663938557/profile-default-circle_cataqk.png",
  },
});

module.exports = model("User", userSchema);

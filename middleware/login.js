const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/key");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res
      .status(401)
      .json({ err: "Siz bu saytda ro'yxatdan o'tgan bo'lishingiz kerak!" });
  }
  const token = authorization.replace("Mirshod ", "");
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({
        err: "Avtorizatsiya tasdiqlanmadi, iltimos keyinroq qaytadn urinib ko'ring!",
      });
    }

    const { _id } = payload;
    User.findById(_id).then((user) => {
      req.user = user;
      next();
    });
  });
};

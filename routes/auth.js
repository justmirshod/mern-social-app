const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/key");
const login = require("../middleware/login");

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    res.status(422).json({ error: "Iltimos hamma bosh joylarni to'ldiring!" });
  }

  User.findOne({ email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "Bu email bilan ro'yxatdan o'tilgan" });
    }

    bcrypt.hash(password, 10).then((hashedPassword) => {
      const user = new User({
        email,
        name,
        password: hashedPassword,
        pic,
      });

      user
        .save()
        .then(() => {
          res.json({ msg: "Foydalanuvchi muvaffaqiyatli saqlandi" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ err: "Iltimos hamma joylarni toldiring" });
  }

  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ err: "Bunday foydalanuvchi mavjud emas" });
    }

    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({ msg: "Successfully signed in" })
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token: token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ err: "Noto'g'ri parol yoki email" });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });
});

module.exports = router;

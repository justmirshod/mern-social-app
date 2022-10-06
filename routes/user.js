const { Router } = require("express");
const router = Router();
const login = require("../middleware/login");
const User = require("../models/User");
const Post = require("../models/Post");

router.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate("postedBy", "_id, name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(422).json({ err: "Foydalanuvchi topilmadi!" });
    });
});

router.put("/follow", login, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: {
        followers: req.user._id,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: {
            following: req.body.followId,
          },
        },
        { new: true }
      ).then((result) => {
        res.json(result);
      });
    }
  );
});

router.put("/unfollow", login, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: {
        followers: req.user._id,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ err });
      }
      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: {
            following: req.body.unfollowId,
          },
        },
        { new: true }
      ).then((result) => {
        res.json(result);
      });
    }
  );
});

router.put("/updatepic", login, (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { pic: req.body.pic } },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ err: " Something went wrong" });
      } else {
        res.json(result);
      }
    }
  );
});

router.put("/editname", login, (req, res) => {
  const { name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        name,
      },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.json(422).json({ err });
      } else {
        res.json(result);
      }
    }
  );
});

router.post("/searchuser", login, (req, res) => {
  const userSearchPanel = new RegExp("^" + req.body.query);
  User.find({
    email: {
      $regex: userSearchPanel,
    },
  })
    .select("_id name email pic")
    .then((user) => res.json({ user }))
    .catch((e) => console.log(e));
});

module.exports = router;

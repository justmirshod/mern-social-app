const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");
const login = require("../middleware/login");
const Post = require("../models/Post");

router.get("/allposts", login, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.commentedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.post("/createpost", login, (req, res) => {
  const { title, body, photo } = req.body;
  if (!title || !body || !photo) {
    return res
      .status(422)
      .json({ err: "Iltimos hamma bosh joylarni toldiring" });
  }

  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });

  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.get("/myposts", login, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name followers following")
    .then((myPosts) => {
      res.json({ myPosts });
    })
    .catch((e) => {
      console.log(e);
    });
});

router.put("/like", login, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "name _id")
    .populate("comments.commentedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ err });
      } else {
        return res.json({ result });
      }
    });
});

router.put("/unlike", login, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "name _id")
    .populate("comments.commentedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ err });
      } else {
        return res.json({ result });
      }
    });
});

router.put("/comments", login, (req, res) => {
  const comment = {
    text: req.body.text,
    commentedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: {
        comments: comment,
      },
    },
    {
      new: true,
    }
  )
    .populate("comments.commentedBy", "_id, name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        res.status(422).json({ err });
      } else {
        res.json({ result });
      }
    });
});

router.delete("/delete/:postId", login, (req, res) => {
  Post.findOne({ _id: req.params.postId }).exec((err, post) => {
    if (err === !post) {
      return res.status(422).json({ err });
    }
    if (post.postedBy._id.toString() === req.user._id.toString()) {
      post
        .remove()
        .then(() => {
          res.json({ msg: "Post muvaffaqiyatli o'chirildi" });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      res.json({ msg: "Sorry but you can not delete this post!" });
    }
  });
});

router.get("/getsubsposts", login, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.commentedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

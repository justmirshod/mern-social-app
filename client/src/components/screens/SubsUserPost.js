import { useState, useEffect, useContext } from "react";
import M from "materialize-css";
import "./css/home.css";
import HomePosts from "./HomePosts";
import HomeSideBar from "./HomeSideBar";
import { UserContext } from "../../App";

export default function SubsUserPost() {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("/getsubsposts", {
      headers: {
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = data.map((item) => {
          if (item._id === res.result._id) {
            return res.result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = data.map((item) => {
          if (item._id === res.result._id) {
            return res.result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const commentPost = (text, postId) => {
    fetch("/comments", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id === result.result._id) {
            return result.result;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const deletePost = (postId) => {
    fetch(`/delete/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const newData = data.filter((item) => {
          if (item._id === postId) {
            dispatch({
              type: "DELETE_POST_BY_ID",
              payload: {
                deletedPostId: item._id,
              },
            });
          }

          return item._id !== postId;
        });
        setData(newData);
        M.toast({ html: res.msg, classes: "light-green darken-3" });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <div className="home">
      <div className="post__items">
        <div className="left__side">
          <h4 style={{ color: "white" }}>Maqolalar</h4>
          {data
            .map((item) => {
              return (
                <HomePosts
                  key={item._id}
                  item={item}
                  likePost={likePost}
                  unLikePost={unLikePost}
                  commentPost={commentPost}
                  deletePost={deletePost}
                />
              );
            })
            .reverse()}
        </div>
        {/* <div className="right__side">
          <HomeSideBar />
        </div> */}
      </div>
    </div>
  );
}

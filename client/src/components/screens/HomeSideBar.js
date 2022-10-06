import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import "./css/home.css";

export default function HomeSideBar() {
  const [posts, setPosts] = useState([]);
  const { state } = useContext(UserContext);
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        const newMyPosts = res.myPosts.filter((item) => {
          if (state.deletedPostId) {
            return item._id !== state.deletedPostId;
          } else {
            return item;
          }
        });
        setPosts(newMyPosts);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [state]);

  return (
    <>
      <h4 style={{ color: "white" }}>Mening postlarim</h4>
      {posts.length ? (
        posts.map((item) => {
          return (
            <div className="card" key={item._id}>
              <div className="card-image">
                <img alt={item._id} src={item.photo} />
              </div>
              <div className="card-content">
                <b>{item.title}</b>
                <p>{item.body}</p>
              </div>
            </div>
          );
        })
      ) : (
        <h6 style={{ color: "white" }}>Hozircha sizda postlaringiz yoq</h6>
      )}
    </>
  );
}

import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import empty from "../../images/empty.png";
import full from "../../images/full.png";
export default function HomePosts(props) {
  const { state } = useContext(UserContext);
  const [showComments, setShowComments] = useState(false);
  const { item, likePost, unLikePost, commentPost, deletePost } = props;
  return (
    <div className="card" key={item._id}>
      <Link
        to={
          item.postedBy._id === state._id
            ? "/profile"
            : "/profile/" + item.postedBy._id
        }
      >
        <p className="card-title postedBy">{item.postedBy.name}</p>
      </Link>
      <div className="card-image">
        <img alt={item._id} src={item.photo} />
      </div>
      <div className="card-content">
        {item.likes.includes(state._id) ? (
          <img
            src={full}
            style={{ cursor: "pointer" }}
            alt=""
            onClick={() => unLikePost(item._id)}
          />
        ) : (
          // <i className="material-icons" onClick={() => likePost(item._id)}>
          //   thumb_up
          // </i>
          <img
            src={empty}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => likePost(item._id)}
          />
        )}
        <i
          className="material-icons"
          style={{ marginLeft: "10px", cursor: "pointer" }}
          onClick={() => setShowComments(!showComments)}
        >
          comment
        </i>
        {item.postedBy._id === state._id ? (
          <i
            className="material-icons"
            style={{ marginLeft: "10px ", cursor: "pointer" }}
            onClick={() => deletePost(item._id)}
          >
            delete
          </i>
        ) : null}

        <p>{item.likes.length} likes</p>
        <h4>{item.title}</h4>
        <p style={{ marginBottom: 10 }}>{item.body}</p>
        {showComments
          ? item.comments.map((m) => {
              return (
                <p key={m._id}>
                  <b>{m.commentedBy.name} </b>
                  {m.text}
                </p>
              );
            })
          : null}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            commentPost(e.target[0].value, item._id);
            e.target[0].value = "";
          }}
        >
          <input type="text" placeholder="Maqola haqida fikringiz" />
        </form>
      </div>
    </div>
  );
}

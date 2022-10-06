import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";
import Loader from "./Loader";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { state, dispatch } = useContext(UserContext);
  const [myName, setMyName] = useState("");
  const [updateProfileModal, setUpdateProfileModal] = useState(false);
  const [ex, setEx] = useState("");
  useEffect(() => {
    setIsLoading(true);
    fetch("/myposts", {
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setPosts(res.myPosts);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "mernGram");
      formData.append("cloud_name", "dq5hzxrm7");
      fetch("https://api.cloudinary.com/v1_1/dq5hzxrm7/image/upload", {
        method: "post",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: "Mirshod " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem("user", JSON.stringify(result));
              dispatch({ type: "UPDATEPIC", payload: result.pic });
              M.toast({
                html: "Sizning profilingiz muvaffaqiyatli o'zgartirildi",
                classes: " light-green darken-3",
              });
            });
        });
    }
    //eslint-disable-next-line
  }, [image]);

  const updateProfilePhoto = (file) => {
    setImage(file);
  };

  const editProfile = () => {
    fetch("/editname", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        name: myName === "" ? state.name : myName,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res));
        dispatch({ type: "EDITNAME", payload: res.name });
      })
      .catch((e) => console.log(e));
  };

  const myPosts = () => {
    if (!posts.length) {
      return <div>Sizda hali postlar mavjud emas</div>;
    } else {
      return posts.map((item) => {
        return (
          <div className="img-item" key={item._id}>
            <img src={item.photo} alt={item._id} />
          </div>
        );
      });
    }
  };

  return (
    <>
      <div className="profile">
        <div className="profile_main">
          <div className="containers">
            <img
              src={
                state && state.pic
                  ? state.pic
                  : "https://res.cloudinary.com/dq5hzxrm7/image/upload/v1663938557/profile-default-circle_cataqk.png"
              }
              alt="Avatar"
              className="profile_img image"
            />
            <div className="middles">
              <div className="texts">
                <button className="btn" onClick={() => setIsOpenModal(true)}>
                  <i className="material-icons">add_a_photo</i>
                </button>
              </div>
            </div>
          </div>
          <div>
            <div className="profile_header">
              <h4>{state ? state.name : "Loading"}</h4>
              <button
                className="btn"
                style={{ display: "flex", alignItems: "center" }}
                onClick={() => setUpdateProfileModal(true)}
              >
                <i className="material-icons" style={{ marginRight: 10 }}>
                  settings
                </i>
                <span>Edit</span>
              </button>
            </div>
            <div className="intro_profile">
              <p>{posts.length} posts</p>
              <p>{state ? state.followers.length : 0} followers</p>
              <Link to={"/mefollowingpost"}>
                <p>{state ? state.following.length : 0} following</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="gallery">{isLoading ? <Loader /> : myPosts()}</div>
      </div>
      {isOpenModal ? (
        <div className="modals" onClick={() => setIsOpenModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5>Profil rasmingizni qo'shing</h5>
              <i
                style={{ cursor: "pointer" }}
                onClick={() => setIsOpenModal(false)}
                className="material-icons"
              >
                close
              </i>
            </div>
            <div className="file-field input-field">
              <div className="btn">
                <span>
                  <i className="material-icons">add_a_photo</i>
                </span>
                <input
                  type="file"
                  onChange={(e) => {
                    setEx(e.target.files[0]);
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={() => {
                  setIsOpenModal(false);
                  updateProfilePhoto(ex);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {updateProfileModal ? (
        <div
          className="modals"
          onClick={() => {
            setUpdateProfileModal(false);
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="modal-header">
              <i
                style={{ cursor: "pointer" }}
                onClick={() => setUpdateProfileModal(false)}
                className="material-icons"
              >
                close
              </i>
            </div>
            <div className="file-field input-field">
              <div className="btn">
                <span>
                  <i className="material-icons">add_a_photo</i>
                </span>
                <input type="file" onChange={(e) => setEx(e.target.files[0])} />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <div className="name-field">
              <div>
                <button className="btn">
                  <i className="medium material-icons">account_circle</i>
                </button>
              </div>
              <div className="input-field">
                <input
                  type="text"
                  onChange={(e) => setMyName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn"
                onClick={(e) => {
                  editProfile();
                  updateProfilePhoto(ex);
                  setUpdateProfileModal(false);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

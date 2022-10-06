import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import Loader from "./Loader";

export default function UsersProfile() {
  const [profile, setProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(true);
  const { userId } = useParams();
  console.log(profile);
  useEffect(() => {
    fetch(`/user/${userId}`, {
      headers: {
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setProfile(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(profile);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prev) => {
          return {
            ...prev,
            user: {
              ...prev.user,
              followers: [...prev.user.followers, data._id],
            },
          };
        });
      });
  };

  const unFollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prev) => {
          const newProfile = prev.user.followers.filter((m) => {
            return m !== data._id;
          });
          return {
            ...prev,
            user: {
              ...prev.user,
              followers: newProfile,
            },
          };
        });
      });
  };

  return (
    <>
      {profile ? (
        <div className="profile">
          <div className="profile_main">
            <div>
              <img
                className="profile_img"
                src={
                  profile.user.pic
                    ? profile.user.pic
                    : "https://res.cloudinary.com/dq5hzxrm7/image/upload/v1663938557/profile-default-circle_cataqk.png"
                }
                alt="profile"
              />
            </div>
            <div>
              <h4>{profile.user.name}</h4>
              <div className="intro_profile">
                <p>
                  {profile.posts.length === 1
                    ? profile.posts.length + "post"
                    : profile.posts.length + "posts"}
                </p>
                <p>{profile.user.followers.length} followers</p>
                <p>{profile.user.following.length} following</p>
              </div>
              <div>
                {!profile.user.followers.includes(state._id) ? (
                  <button className="btn" onClick={followUser}>
                    Follow
                  </button>
                ) : (
                  <button className="btn" onClick={unFollowUser}>
                    Unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="gallery">
            {profile.posts.map((item) => {
              return (
                <div className="img-item" key={item._id}>
                  <img src={item.photo} alt={item._id} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </>
  );
}

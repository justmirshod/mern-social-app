import { useState, useEffect } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Authorization: "Mirshod " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          photo: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.err) {
            M.toast({ html: data.err, classes: "red darken-1" });
            setIsLoading(false);
          } else {
            M.toast({
              html: "Post muvaffaqiyatli joylashtirildi",
              classes: "light-green darken-2",
            });
            navigate("/");
            setIsLoading(false);
          }
        });
    }
    //eslint-disable-next-line
  }, [url]);

  const PostDetails = () => {
    setIsLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mernGram");
    data.append("cloud_name", "dq5hzxrm7");
    fetch("https://api.cloudinary.com/v1_1/dq5hzxrm7/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setIsLoading(false);
          return M.toast({
            html: "Iltimos hamma bo'sh joylarni to'ldiring!",
            classes: "red darken-1",
          });
        }
        setUrl(data.url);
      })
      .catch((err) => console.log("Error" + err));
  };

  return (
    <div className="postBody">
      <div className="card cardPost">
        <div className="card-image">
          <img
            alt="imgPost"
            src="https://images.unsplash.com/photo-1490117874548-e35a2286fd89?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGhvdG8lMjBjYW1lcmF8ZW58MHwwfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
          />
          <span className="card-title">Maqola</span>
          <a
            href="!#"
            className="btn-floating halfway-fab waves-effect waves-light red file_wrapper"
          >
            <i className="material-icons file_icon">add</i>
            <input
              type="file"
              className="file_img"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </a>
        </div>
        <div className="card-content">
          <div className="input-field col s6">
            <i className="material-icons prefix">subtitles</i>
            <input
              id="icon_prefix"
              type="text"
              className="validate"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="icon_prefix">Sarlavha</label>
          </div>
          <div className="input-field col s6">
            <i className="material-icons prefix">content_paste</i>
            <input
              id="icon_prefix"
              type="text"
              className="validate"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <label htmlFor="icon_prefix">Maqola</label>
          </div>
          {isLoading ? (
            <button className="btn btn_loader" disabled>
              <span style={{ color: "black" }}>Maqola qo'shilmoqda</span>
              <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </button>
          ) : (
            <button className="btn" onClick={PostDetails}>
              Maqola qoshish
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

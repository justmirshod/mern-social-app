// import { Link } from "react-router-dom";
import { useState } from "react";
import "./css/Singin.css";
import Login from "./loginPage/Login";
import SignUp from "./loginPage/SignUp";
export default function Signin() {
  const [regName, setRegName] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [active, setActive] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(null);

  const toggleForm = () => {
    setActive((prev) => !prev);
  };

  const uploadAvatar = () => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "mernGram");
    formData.append("cloud_name", "dq5hzxrm7");
    fetch("https://api.cloudinary.com/v1_1/dq5hzxrm7/image/upload", {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => setUrl(data.url));
  };

  return (
    <>
      <section>
        <div className={active ? "auth_container" : "auth_container active"}>
          <div className="user signinBx">
            <div className="imgBx">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1576859958081-27de5c70262a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80"
              />
            </div>
            <Login
              logEmail={logEmail}
              setLogEmail={setLogEmail}
              logPassword={logPassword}
              setLogPassword={setLogPassword}
              toggleForm={toggleForm}
            />
          </div>
          <div className="user signupBx">
            <SignUp
              regEmail={regEmail}
              regPassword={regPassword}
              regName={regName}
              setRegEmail={setRegEmail}
              setRegPassword={setRegPassword}
              setRegName={setRegName}
              toggleForm={toggleForm}
              isOpenModal={isOpenModal}
              setIsOpenModal={setIsOpenModal}
              uploadAvatar={uploadAvatar}
              url={url}
              image={image}
            />
            <div className="imgBx">
              <img
                alt=""
                src="https://images.unsplash.com/photo-1596003906949-67221c37965c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8YmxhY2slMjBjb2Rpbmd8ZW58MHwxfDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
              />
            </div>
          </div>
        </div>
      </section>
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
                <span>File</span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setIsOpenModal(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

import M from "materialize-css";
import { useEffect } from "react";
export default function SignUp(props) {
  const {
    regName,
    regEmail,
    regPassword,
    setRegName,
    setRegPassword,
    setRegEmail,
    toggleForm,
    setIsOpenModal,
    uploadAvatar,
    url,
    image,
  } = props;

  const ourFields = () => {
    // eslint-disable-next-line
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(regEmail)) {
      M.toast({
        html: "Email manzilingizni togri kiriting!",
        classes: "red darken-1",
      });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        name: regName,
        email: regEmail,
        password: regPassword,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: " red darken-1" });
        } else {
          M.toast({ html: data.msg, classes: "light-green darken-2" });
          setRegEmail("");
          setRegName("");
          setRegPassword("");
          toggleForm();
        }
      });
  };

  useEffect(() => {
    if (url) {
      ourFields();
    }
  }, [url]);

  const postData = () => {
    if (image) {
      uploadAvatar();
    } else {
      ourFields();
    }
  };

  return (
    <>
      <div className="formBx">
        <div className="form">
          <h2 style={{ marginTop: "0px" }}>Ro'yxatdan o'tish</h2>
          <div className="containers">
            <img
              src="https://res.cloudinary.com/dq5hzxrm7/image/upload/v1663938557/profile-default-circle_cataqk.png"
              alt="Avatar"
              className="images"
            />
            <div className="middles">
              <div className="texts">
                <button className="btn" onClick={() => setIsOpenModal(true)}>
                  <i className="material-icons">add_a_photo</i>
                </button>
              </div>
            </div>
          </div>

          <input
            type="text"
            placeholder="Foydalanuvchi nomi"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email manzilingiz"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Parol"
            value={regPassword}
            onChange={(e) => setRegPassword(e.target.value)}
          />
          <button type="submit" className="btn" onClick={postData}>
            Ro'yxatdan otish
          </button>
          <p className="signup">
            Allaqachon ro'yxatdan o'tganmisiz?
            {/* eslint-disable-next-line */}
            <b
              style={{ fontWeight: "600", cursor: "pointer" }}
              onClick={toggleForm}
            >
              {" "}
              Akkauntga kirish{" "}
            </b>
          </p>
        </div>
      </div>
    </>
  );
}

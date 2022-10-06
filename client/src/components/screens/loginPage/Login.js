import { UserContext } from "../../../App";
import { useContext } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

export default function Login(props) {
  //eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  const { logEmail, setLogEmail, logPassword, setLogPassword, toggleForm } =
    props;

  const navigate = useNavigate();
  const postLogData = () => {
    // eslint-disable-next-line
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(logEmail)) {
      return M.toast({
        html: "Email manzilingizni togri kiriting!",
        classes: "red darken-1",
      });
    }
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        email: logEmail,
        password: logPassword,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.err) {
          M.toast({ html: res.err, classes: "red darken-1" });
        } else {
          localStorage.setItem("jwt", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));
          dispatch({ type: "USER", payload: res.user });
          M.toast({
            html: "Siz muvaffaqiyatli kirdingiz",
            classes: "light-green darken-2",
          });
          navigate("/");
          setLogEmail("");
          setLogPassword("");
        }
      });
  };
  return (
    <div className="formBx">
      <div className="form">
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email manzilingiz"
          value={logEmail}
          onChange={(e) => setLogEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Parol"
          value={logPassword}
          onChange={(e) => setLogPassword(e.target.value)}
        />
        <button
          className="btn"
          onClick={() => {
            postLogData();
          }}
        >
          Profilga kirish
        </button>
        <p className="signup">
          Hali ro'yxatdan o'tmadingizmi?{/* eslint-disable-next-line */}
          <b
            style={{ fontWeight: "600", cursor: "pointer" }}
            onClick={toggleForm}
          >
            Ro'yxatdan o'tish
          </b>
        </p>
      </div>
    </div>
  );
}

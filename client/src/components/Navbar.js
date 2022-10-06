import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../App";
import M from "materialize-css";
import "./Navbar.css";

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userFound, setUserFound] = useState([]);
  const navigate = useNavigate();
  const searchPanel = useRef(null);

  useEffect(() => {
    M.Modal.init(searchPanel.current);
  }, [state]);

  const searchUser = (query) => {
    setSearch(query);
    fetch("/searchuser", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: "Mirshod " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setUserFound(result.user);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderNav = () => {
    if (state) {
      return [
        <>
          <li key={0}>
            <i
              data-target="modal1"
              style={{ color: "white", marginRight: 10, cursor: "pointer" }}
              className="material-icons modal-trigger"
            >
              search
            </i>
          </li>
          <li key={1}>
            <Link to="/profile">
              <i className="  material-icons">person_pin</i>
            </Link>
          </li>
          <li key={2}>
            <Link to="/createpost">
              <i className=" material-icons">add_box</i>
            </Link>
          </li>
          <li key={3}>
            <a>
              <i
                className=" material-icons"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  localStorage.clear();
                  dispatch({ type: "CLEAR" });
                  navigate("/signin");
                }}
              >
                exit_to_app
              </i>
            </a>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li key={4}>
            <Link to="/signin">
              <i className="material-icons">input</i>
            </Link>
          </li>
        </>,
      ];
    }
  };
  return (
    <div className="navbar">
      <div className="navigationBar">
        <div className="mainPage">
          <Link to={state ? "/" : "/signin"}>
            <i className="medium material-icons">home</i>
          </Link>
        </div>
        <div className="navLink">
          <ul>{renderNav()}</ul>
        </div>
      </div>

      {state ? (
        <div id="modal1" className="modal" ref={searchPanel}>
          <div className="modal-content content_modal">
            <div className="input-field col s6">
              <i className="material-icons prefix">search</i>
              <input
                id="icon_prefix"
                type="text"
                className="validate"
                value={search}
                onChange={(e) => searchUser(e.target.value)}
              />
              <label htmlFor="icon_prefix">Email</label>
            </div>
            <div>
              <ul className="collection">
                {userFound.map((item) => {
                  return (
                    <Link
                      to={
                        item._id === state._id
                          ? "/profile"
                          : "/profile/" + item._id
                      }
                      onClick={() =>
                        M.Modal.getInstance(searchPanel.current).close()
                      }
                    >
                      <li className="collection-item avatar">
                        <img
                          src={item.pic}
                          alt={item.name}
                          className="circle"
                        />
                        <span className="title">
                          <b>{item.name}</b> <br /> {item.email}{" "}
                        </span>
                      </li>
                    </Link>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            {/* eslint-disable-next-line */}
            <a className="modal-close waves-effect waves-green btn-flat">
              Yopish
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

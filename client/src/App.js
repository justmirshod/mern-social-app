import { createContext, useReducer, useEffect, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import UsersProfile from "./components/screens/UsersProfile";
import CreatePost from "./components/screens/CreatePost";
import { reducer, initialState } from "./reducers/userReducer";
import SubsUserPost from "./components/screens/SubsUserPost";

export const UserContext = createContext();

const Routing = () => {
  const navigate = useNavigate();
  //eslint-disable-next-line
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/signin");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/createpost" element={<CreatePost />} />
      <Route path="/profile/:userId" element={<UsersProfile />} />
      <Route path="/mefollowingpost" element={<SubsUserPost />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Router>
        <Navbar />
        <Routing />
      </Router>
    </UserContext.Provider>
  );
}

export default App;

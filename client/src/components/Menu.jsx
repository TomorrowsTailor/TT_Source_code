import { useContext } from "react";
import { UserContext } from "../context/UserContext";
//import axios from "axios";
//import { URL } from "../url";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style.css";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../context/user/userSlice";

const Menu = () => {
  const { user } = useContext(UserContext);
  const userDataString = sessionStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const { data } = userData;
  const {setInfo }=useContext(UserContext);
  const {setUser}=useContext(UserContext);
  const dispatch=useDispatch()


  const navigate = useNavigate();

  const handleLogout = async () => {
      setUser(null);
      setInfo({});
      dispatch(setUserInfo({}));
      sessionStorage.removeItem("userData");
      localStorage.removeItem("user");
      navigate("/",{replace:true});
      window.location.reload();
  };
  return (
    <div className="w-[300px] z-10 flex flex-row items-start absolute t-12 right-10 md:right-32 rounded-md p-6 navitems text-l">
      {!user && (
        <h3 className="text-sm hover:text-gray-500 cursor-pointer">
          <Link to="/">Login</Link>
        </h3>
      )}
      {!user && (
        <h3 className="text-sm hover:text-gray-500 cursor-pointer">
          <Link to="/register">Register</Link>
        </h3>
      )}
      {user && (
        <h3 className=" ">
          <Link to={"/profile/" + data._id}>Profile</Link>
        </h3>
      )}
      {user && (
        <h3 className="">
          <Link to={"/customise"}>Customise</Link>
        </h3>
      )}

      {user && (
        <h3 onClick={handleLogout} className="logout">
          Logout
        </h3>
      )}
    </div>
  );
};

export default Menu;

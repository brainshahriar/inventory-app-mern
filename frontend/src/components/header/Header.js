import React from "react";
import { logoutUser } from "../../services/authService";
import { useDispatch } from "react-redux";
import { SET_LOGIN } from "../../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async() =>{
      await logoutUser();
      dispatch(SET_LOGIN(false));
      navigate('/login')
  }
  return (
    <div className="--pad header">
      <div className="--flex-between">
        <h3>
          <span className="--fw-thin">Welcome, </span>
          <span className="--color-danger">Test</span>
        </h3>
        <button className="--btn --btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
      <hr />
    </div>
  );
};

export default Header;

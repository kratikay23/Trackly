import { useEffect } from "react";
import { useDispatch } from "react-redux";
import apiClient from "../../apiClient";
import API from "../../API";
import { setUser, signOut } from "../react-redux/UserSlice";

async function loadUserFromSession() {
  try {
    const res = await apiClient.get(API.CURRENT_USER);
    return res.data;
  } catch {
    try {
      const res = await apiClient.post(API.REFRESH_SESSION);
      return res.data.user;
    } catch {
      return null;
    }
  }
}

function AuthBootstrap({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    loadUserFromSession().then((user) => {
      dispatch(user ? setUser(user) : signOut());
    });
  }, [dispatch]);

  return children;
}

export default AuthBootstrap;

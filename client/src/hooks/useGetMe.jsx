import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetMe = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const dispatch=useDispatch()

useEffect(() => {
  console.log("Hook running");

  const fetchUser = async () => {
    console.log("Fetching user");

    try {
      const { data } = await axios.get(
        `${serverUrl}/api/auth/me`,
        {
          withCredentials: true,
        }
      );
      dispatch(setUserData(data))

      setUser(data.user);
    } catch (error) {
      console.log(error.response);
      setErr(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

  return {
    user,
    loading,
    err,
  };
};

export default useGetMe;
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

const useGetMe = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/auth/me`, {
          withCredentials: true,
          timeout: 10000,
        });

        if (!mounted) return;

        const loggedInUser = response.data?.user || null;

        if (loggedInUser) {
          dispatch(setUserData(loggedInUser));
          setUser(loggedInUser);
        } else {
          dispatch(setUserData(null));
          setUser(null);
        }

        setErr("");
      } catch (error) {
        if (!mounted) return;

        console.log(
          "Get Me Error:",
          error.response?.status,
          error.response?.data || error.message,
        );

        // 401 simply means the user is not logged in.
        // It should NOT keep the application loading.
        if (error.response?.status === 401) {
          setErr("");
        } else {
          setErr(
            error.response?.data?.message || "Unable to check authentication",
          );
        }

        dispatch(setUserData(null));
        setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  return {
    user,
    loading,
    err,
  };
};

export default useGetMe;

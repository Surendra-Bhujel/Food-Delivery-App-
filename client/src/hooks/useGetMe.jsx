import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const useGetMe = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/auth/me`, {
          withCredentials: true,
          timeout: 5000,
        });

        if (!mounted) return;

        const user = response.data?.user || response.data?.data || null;

        dispatch(setUserData(user));
      } catch (error) {
        if (!mounted) return;

        if (error.code === "ECONNABORTED") {
          console.log("Authentication request timed out.");
        } else {
          console.log(
            "No authenticated user:",
            error.response?.data?.message || error.message,
          );
        }

        dispatch(setUserData(null));
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

  return { loading };
};

export default useGetMe;

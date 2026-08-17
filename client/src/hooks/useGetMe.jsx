import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData, setAuthLoading } from "../redux/userSlice";

const useGetMe = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setAuthLoading(true));

      try {
        const response = await axios.get(`${serverUrl}/api/auth/me`, {
          withCredentials: true,
        });

        console.log("ME RESPONSE:", response.data);

        const user =
          response.data?.user ||
          response.data?.data ||
          null;

        if (user) {
          console.log("LOGGED IN USER:", user);
          console.log("USER ROLE:", user.role);

          dispatch(setUserData(user));
        } else {
          dispatch(setUserData(null));
        }
      } catch (error) {
        console.log(
          "Get Me Error:",
          error.response?.data || error.message
        );

        dispatch(setUserData(null));
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetMe;
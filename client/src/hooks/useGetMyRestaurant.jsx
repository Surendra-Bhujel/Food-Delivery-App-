import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setRestaurant } from "../redux/ownerSlice";

const useGetMyRestaurant = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData?.role !== "owner") return;

    const fetchRestaurant = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/restaurants/my-restaurant`,
          {
            withCredentials: true,
          }
        );

        dispatch(setRestaurant(result.data.data));
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(setRestaurant(null));
          return;
        }

        console.log(
          "Get My Restaurant Error:",
          error.response?.data || error.message
        );
      }
    };

    fetchRestaurant();
  }, [dispatch, userData]);

  return null;
};

export default useGetMyRestaurant;
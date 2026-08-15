import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { serverUrl } from "../App";
import { setRestaurant } from "../redux/ownerSlice";

const useGetMyRestaurant = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/restaurants/my-restaurant`,
          {
            withCredentials: true,
          },
        );

        dispatch(setRestaurant(result.data.data));
      } catch (error) {
        if (error.response?.status === 404) {
          // Owner doesn't have a restaurant yet.
          // This is not a frontend error.
          dispatch(setRestaurant(null));
          return;
        }

        console.error(
          "Get restaurant error:",
          error.response?.data || error.message,
        );
      }
    };

    fetchRestaurant();
  }, [dispatch]);
};

export default useGetMyRestaurant;

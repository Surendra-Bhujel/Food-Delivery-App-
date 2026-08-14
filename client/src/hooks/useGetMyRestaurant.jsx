import axios from "axios";
import { useEffect } from "react";
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
  }, [dispatch]);
};

export default useGetMyRestaurant;
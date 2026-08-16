import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchCart } from "../redux/cartSlice";

const useGetCart = () => {
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData?.role === "customer") {
      dispatch(fetchCart());
    }
  }, [userData, dispatch]);
};

export default useGetCart;
import { useSelector } from "react-redux";
import Nav from "../components/Nav";
import UserDashboard from "../components/userDashboard";
import OwnerDashboard from "../components/ownerDashboard";
import DeliveryBoy from "../components/DeliveryBoy";

const Home = () => {
  const { userData } = useSelector((state) => state.user);

  if (!userData) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold">
          No user logged in
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#fff9f6]">

      {userData.role === "customer" && (
        <>
          <Nav />
          <UserDashboard />
        </>
      )}

      {userData.role === "owner" && (
        <OwnerDashboard />
      )}

      {userData.role === "rider" && (
        <DeliveryBoy />
      )}

    </div>
  );
};

export default Home;
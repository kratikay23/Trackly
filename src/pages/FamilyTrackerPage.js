import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/navBar";
import Footer from "../components/footer";
import FamilySidebar from "../components/FamilySideBar";
import { Outlet } from "react-router-dom";

const FamilyTrackerPage = () => {
  const { user } = useSelector((state) => state.userData);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !user.familyId) {
      alert("You don't have a family. Please create or join a family first.");
      navigate("/profile");
    }
  }, [user, navigate]);


  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f0f4f4" }}>
      {/* Sidebar with fixed width */}
      <div style={{ width: "340px" }}>
        <FamilySidebar />
      </div>

      {/* Main area (chat / live map / group etc) fills remaining space */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default FamilyTrackerPage;

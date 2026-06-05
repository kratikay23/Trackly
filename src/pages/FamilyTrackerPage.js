import { useEffect, useState } from "react";
import apiClient from "../apiClient";
import { useNavigate, useLocation, NavLink, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import API from "../API";
import FamilySidebar from "../components/FamilySideBar";
import { toast } from "react-toastify";
import { updateUser } from "../components/react-redux/UserSlice";
import "./familyTracker.css";

const FamilyTrackerPage = () => {
  const { user } = useSelector((state) => state.userData);
  const userId = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [ready, setReady] = useState(false);

  const isLiveMap = location.pathname.includes("/live-map");
  const isGroupChat = location.pathname.includes("/family-group");
  const isMembersPanel = !isLiveMap && !isGroupChat;

  useEffect(() => {
    if (!userId) {
      navigate("/sign-in");
      return;
    }

    const checkFamily = async () => {
      try {
        const res = await apiClient.get(API.GET_FAMILY);

        if (res.data?.family) {
          dispatch(
            updateUser({
              familyId: res.data.family._id,
              role: res.data.role,
            })
          );
          setReady(true);
          return;
        }

        toast.error("You don't have a family. Please create or join a family first.");
        navigate("/profile");
      } catch (error) {
        if (error.response?.status === 404) {
          toast.error("You don't have a family. Please create or join a family first.");
          navigate("/profile");
          return;
        }
        toast.error("Could not load family. Please try again.");
        navigate("/profile");
      }
    };

    checkFamily();
  }, [userId, navigate, dispatch]);

  if (!ready) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-success" role="status" />
      </div>
    );
  }

  return (
    <div className="family-tracker-layout">
      <aside
        className={`family-tracker-sidebar-wrap ${
          !isMembersPanel ? "family-tracker-panel-hidden" : ""
        }`}
      >
        <FamilySidebar />
      </aside>

      <main
        className={`family-tracker-main ${
          isMembersPanel ? "family-tracker-panel-hidden" : ""
        }`}
      >
        <div className="family-tracker-main-inner">
          <Outlet />
        </div>
      </main>

      <nav className="family-tracker-bottom-nav d-md-none" aria-label="Family tracker">
        <NavLink
          to="/family-tracker"
          end
          className={({ isActive }) =>
            `family-tracker-nav-btn ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon" aria-hidden>👥</span>
          <span>Members</span>
        </NavLink>
        <NavLink
          to="/family-tracker/live-map"
          className={({ isActive }) =>
            `family-tracker-nav-btn ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon" aria-hidden>📍</span>
          <span>Live Map</span>
        </NavLink>
        <NavLink
          to="/family-tracker/family-group"
          className={({ isActive }) =>
            `family-tracker-nav-btn ${isActive ? "active" : ""}`
          }
        >
          <span className="nav-icon" aria-hidden>💬</span>
          <span>Chat</span>
        </NavLink>
        <button
          type="button"
          className="family-tracker-nav-btn"
          onClick={() => navigate("/")}
        >
          <span className="nav-icon" aria-hidden>🏠</span>
          <span>Home</span>
        </button>
      </nav>
    </div>
  );
};

export default FamilyTrackerPage;

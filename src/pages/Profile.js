import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";
import FamilyTracker from "./FamilyTracker";
import Footer from "../components/footer.js";
import { logout } from "../components/react-redux/UserSlice.js";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userData);
    const profilePicture = user?.photoUrl || user.picture;
    const emailPrefix = user?.email?.split('@')[0] || "user";

    const handleLogout = () => {
        dispatch(logout());
        localStorage.clear();
        navigate("/sign-in");
    };

    return (
        <>
            <Navbar />
            <div className="container mb-4" style={{ marginTop: "100px" }}>
                <div className="row">
                    {/* LEFT */}
                    <div className="col-md-4 mb-4">
                        <div className="card text-center p-4">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    width="100px"
                                    height="100px"
                                    className="rounded-circle mx-auto d-flex"
                                    alt="Profile"
                                />
                            ) : (
                                <div
                                    className="rounded-circle mx-auto d-flex justify-content-center align-items-center bg-success text-white"
                                    style={{ width: "100px", height: "100px", fontSize: "36px", fontWeight: "bold" }}
                                >
                                    {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <p className="mt-3 text-muted">@{emailPrefix}</p>
                            <h6>{user?.userName}</h6>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="col-md-8 mb-3">
                        <div className="card p-4">
                            <h5 className="mb-3 fw-semibold">Connect</h5>
                            <div className="mb-4">
                                <button className="btn btn-light w-100 text-start" disabled>
                                    {user?.authProvider === "google" ? (
                                        <>
                                            <img
                                                src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-google-icon-PNG.png"
                                                alt="Google Icon"
                                                width="20"
                                                className="me-2"
                                            />
                                            REGISTERED WITH GOOGLE
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8MBP0dJHRYzPAMAjg4TghgVcnBRL1oIaXNw&s"
                                                alt="Email Icon"
                                                width="20"
                                                className="me-2"
                                            />
                                            REGISTERED WITH EMAIL
                                        </>
                                    )}
                                </button>
                            </div>


                            <h5 className="mb-3 fw-semibold">Account data</h5>
                            <div className="mb-3">
                                <label className="form-label text-muted">Username</label>
                                <input type="text" className="form-control" value={user?.userName || ""} />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Email</label>
                                <input type="email" className="form-control" value={user?.email || ""} disabled />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Contact Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Contact Number"
                                    value={user?.contactNo || ""}
                                    disabled
                                />
                            </div>
                            <div className="d-flex justify-content-end gap-2 mt-3">
                                <button className="btn btn-outline-dark">Cancel</button>
                                <button className="btn btn-primary ml-2">Save Change</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-4"></div>
                    <div className="col-md-8">
                        <FamilyTracker />
                    </div>
                </div>

                {/* LOGOUT */}
                <div className="row mt-4">
                    <div className="col-md-12 text-center">
                        <button className="btn btn-danger" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Profile;

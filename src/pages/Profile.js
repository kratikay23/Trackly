import { useSelector, useDispatch } from "react-redux";
import apiClient from "../apiClient";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";
import FamilyTracker from "./FamilyTracker";
import Footer from "../components/footer.js";
import { signOut, updateUser } from "../components/react-redux/UserSlice.js";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../API";
import PasswordField from "../components/PasswordField";

function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userData);
    const [userName, setUserName] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [sendingReset, setSendingReset] = useState(false);
    const isGoogleOnly = user?.authProvider === "google";
    const isLinkedAccount = user?.authProvider === "both";
    const isEmailUser = user?.authProvider === "email";
    const profilePicture = user?.photoUrl || user.picture;
    const emailPrefix = user?.email?.split("@")[0] || "user";

    useEffect(() => {
        setUserName(user?.userName || "");
        setContactNo(user?.contactNo || "");
    }, [user?.userName, user?.contactNo]);

    const resetPasswordFields = () => {
        setPassword("");
        setConfirmPassword("");
    };

    const handleLogout = async () => {
        try {
            await apiClient.post(API.LOGOUT);
        } finally {
            dispatch(signOut());
            navigate("/sign-in");
        }
    };

    const handleCancel = () => {
        setUserName(user?.userName || "");
        setContactNo(user?.contactNo || "");
        resetPasswordFields();
    };

    const handleForgotPassword = async () => {
        if (!user?.email) return;

        try {
            setSendingReset(true);
            await apiClient.post(API.FORGET_PASSWORD, { email: user.email });
            toast.success("Password reset link sent. Check your email.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Could not send reset email.");
        } finally {
            setSendingReset(false);
        }
    };

    const handleSaveChange = async (e) => {
        e.preventDefault();

        const trimmedName = userName.trim();
        const trimmedContact = contactNo.trim();
        const trimmedPassword = password.trim();

        if (!trimmedName) {
            toast.error("Username cannot be empty");
            return;
        }
        if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
            toast.error("Username must contain only alphabets and spaces");
            return;
        }

        if (isGoogleOnly) {
            const wantsEmailLogin = trimmedPassword || trimmedContact || confirmPassword.trim();

            if (wantsEmailLogin) {
                if (!trimmedContact) {
                    toast.error("Contact number is required");
                    return;
                }
                if (!/^[0-9]+$/.test(trimmedContact)) {
                    toast.error("Contact Number must contain only numbers");
                    return;
                }
                if (!trimmedPassword || trimmedPassword.length < 5 || trimmedPassword.length > 8) {
                    toast.error("Password should be 5 to 8 characters");
                    return;
                }
                if (trimmedPassword !== confirmPassword.trim()) {
                    toast.error("Passwords do not match");
                    return;
                }

                try {
                    setSaving(true);
                    const res = await apiClient.post(API.LINK_EMAIL_LOGIN, {
                        userName: trimmedName,
                        contactNo: trimmedContact,
                        password: trimmedPassword,
                    });
                    dispatch(updateUser(res.data.user));
                    resetPasswordFields();
                    toast.success(res.data.message);
                } catch (err) {
                    toast.error(err.response?.data?.message || "Failed to save profile");
                } finally {
                    setSaving(false);
                }
                return;
            }

            if (trimmedName === (user?.userName || "")) {
                toast.info("No changes to save");
                return;
            }

            try {
                setSaving(true);
                const res = await apiClient.put(API.UPDATE_USER, { userName: trimmedName });
                dispatch(updateUser(res.data.user));
                toast.success(res.data.message || "Profile updated");
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to save changes");
            } finally {
                setSaving(false);
            }
            return;
        }

        if (!trimmedContact) {
            toast.error("Contact Number cannot be empty");
            return;
        }
        if (!/^[0-9]+$/.test(trimmedContact)) {
            toast.error("Contact Number must contain only numbers");
            return;
        }

        const nameChanged = trimmedName !== (user?.userName || "");
        const contactChanged = trimmedContact !== (user?.contactNo || "");

        if (!nameChanged && !contactChanged) {
            toast.info("No changes to save");
            return;
        }

        try {
            setSaving(true);
            const res = await apiClient.put(API.UPDATE_USER, {
                userName: trimmedName,
                contactNo: trimmedContact,
            });
            dispatch(updateUser(res.data.user));
            toast.success(res.data.message || "Profile updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="trackly-page profile-page">
            <Navbar />
            <div className="trackly-page-content profile-page-content">
                <div className="row g-3 g-md-4">
                    <div className="col-12 col-md-4 col-lg-3">
                        <div className="card profile-avatar-card text-center h-100">
                            {profilePicture ? (
                                <img
                                    src={profilePicture}
                                    width="100"
                                    height="100"
                                    className="rounded-circle mx-auto d-block profile-avatar-img"
                                    alt="Profile"
                                />
                            ) : (
                                <div className="profile-avatar-placeholder mx-auto">
                                    {user?.userName?.charAt(0)?.toUpperCase() || "U"}
                                </div>
                            )}
                            <p className="mt-3 mb-1 text-muted">@{emailPrefix}</p>
                            <h6 className="mb-0">{user?.userName}</h6>
                        </div>
                    </div>

                    <div className="col-12 col-md-8 col-lg-9">
                        <div className="card profile-form-card">
                            <h5 className="mb-3 fw-semibold">Connect</h5>
                            <div className="mb-4">
                                <button type="button" className="btn btn-light w-100 text-start profile-provider-btn" disabled>
                                    {isGoogleOnly || isLinkedAccount ? (
                                        <>
                                            <img
                                                src="https://image.similarpng.com/file/similarpng/very-thumbnail/2020/06/Logo-google-icon-PNG.png"
                                                alt="Google"
                                                width="20"
                                                className="me-2"
                                            />
                                            REGISTERED WITH GOOGLE
                                        </>
                                    ) : (
                                        <>
                                            <img
                                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8MBP0dJHRYzPAMAjg4TghgVcnBRL1oIaXNw&s"
                                                alt="Email"
                                                width="20"
                                                className="me-2"
                                            />
                                            REGISTERED WITH EMAIL
                                        </>
                                    )}
                                </button>
                            </div>

                            {isGoogleOnly && (
                                <div className="alert alert-light border small mb-3 mb-md-4">
                                    Add your mobile number and password below, then click <strong>Save Change</strong> to
                                    also sign in with email and use Family Tracker.
                                </div>
                            )}

                            <h5 className="mb-3 fw-semibold">Account data</h5>
                            <div className="mb-3">
                                <label className="form-label text-muted">Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Email</label>
                                <input type="email" className="form-control" value={user?.email || ""} disabled readOnly />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-muted">Contact Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Contact Number"
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                />
                            </div>

                            {isGoogleOnly && (
                                <>
                                    <div className="mb-3">
                                        <p className="text-muted small mb-1">Set password to link email login</p>
                                        <label className="form-label text-muted">Password</label>
                                        <PasswordField
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="5–8 characters"
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label text-muted">Confirm Password</label>
                                        <PasswordField
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="profile-action-row">
                                <button type="button" className="btn btn-outline-dark" onClick={handleCancel} disabled={saving}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveChange} disabled={saving}>
                                    {saving ? "Saving…" : "Save Change"}
                                </button>
                            </div>

                            {(isEmailUser || isLinkedAccount) && (
                                <>
                                    <hr className="my-4" />
                                    <h5 className="mb-3 fw-semibold">Password</h5>
                                    <p className="text-muted small mb-3">
                                        Forgot your password? We&apos;ll email a reset link to{" "}
                                        <strong>{user?.email}</strong>.
                                    </p>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={handleForgotPassword}
                                        disabled={sendingReset}
                                    >
                                        {sendingReset ? "Sending…" : "Send reset link"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="row g-3 g-md-4 mt-1">
                    <div className="col-12">
                        <FamilyTracker />
                    </div>
                </div>

                <div className="profile-logout-wrap mt-4">
                    <button type="button" className="btn btn-danger profile-logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Profile;

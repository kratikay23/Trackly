import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import API from "../../API";

import { useLocation } from "react-router-dom";

function ChangePassword() {
    const location = useLocation();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [matchError, setMatchError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [strength, setStrength] = useState("");
    const navigate = useNavigate();

     const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email"); // use this to show/hide email field or send to backend


    const getStrength = (pass) => {
        if (pass.length >= 12 && /[A-Z]/.test(pass) && /\d/.test(pass) && /[@$!%*?&#]/.test(pass)) return "strong";
        if (pass.length >= 8) return "medium";
        return "weak";
    };

    useEffect(() => {
        setStrength(getStrength(newPassword));
        setMatchError(newPassword && confirmPassword && newPassword !== confirmPassword);
    }, [newPassword, confirmPassword]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!newPassword || !confirmPassword || newPassword !== confirmPassword || strength !== "strong") {
            return;
        }
        try {
            setIsLoading(true);
            const res = await axios.post(API.UPDATE_PASSWORD, {
                email,
                password: newPassword,
            });
            console.log(res.data);
            navigate("/sign-in");
        } catch (error) {
            console.error("Error resetting password:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const strengthLabel = {
        weak: "Weak",
        medium: "Medium",
        strong: "Strong",
    };

    const strengthClass = {
        weak: "bg-danger",
        medium: "bg-warning",
        strong: "bg-success",
    };

    const isFormValid = newPassword && confirmPassword && newPassword === confirmPassword && strength === "strong";

    return (
        <>
            {isLoading ? (
                <div className="spinner-border"></div>
            ) : (
                <div className="signup-container d-flex flex-column flex-md-row">
                    {/* Left section */}
                    <div className="left-section d-none d-md-block">
                        <img
                            src="https://res.cloudinary.com/madimages/image/fetch/q_100,f_auto,w_793,h_502/https://s3.amazonaws.com/mobileappdaily/mad/uploads/mad_blog_5ddf7cfcc5bfc1574927612.jpg"
                            alt="illustration"
                            className="img-fluid"
                            style={{ opacity: "50%" }}
                        />
                    </div>

                    {/* Right form section */}
                    <div className="right-section d-flex flex-column justify-content-center align-items-center p-4">
                        <div className="w-100 text-start mb-3">
                            <span role="button" onClick={() => navigate(-1)} className="text-primary">
                                ← Back
                            </span>
                        </div>
                        <div className="form-box">
                            <div className="text-center mb-4">
                                <img src="/assets/logo.png" alt="Logo" height="40" />
                            </div>
                            <h4 className="text-center mb-3">Update password</h4>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label>New Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showNewPass ? "text" : "password"}
                                            className="form-control"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowNewPass(!showNewPass)}>
                                            {showNewPass ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                    {newPassword && (
                                        <>
                                            <div className="progress mt-1">
                                                <div
                                                    className={`progress-bar ${strengthClass[strength]}`}
                                                    style={{ width: strength === "strong" ? "100%" : strength === "medium" ? "66%" : "33%" }}
                                                ></div>
                                            </div>
                                            <small className={`text-${strengthClass[strength].replace("bg-", "")}`}>
                                                {strengthLabel[strength]} – {strength === "strong" ? "Excellent! You're good to go." : "Use a mix of letters, numbers, and symbols."}
                                            </small>
                                        </>
                                    )}
                                </div>

                                <div className="form-group mb-3">
                                    <label>Confirm Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showConfirmPass ? "text" : "password"}
                                            className="form-control"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        <button type="button" className="btn btn-outline-secondary" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                            {showConfirmPass ? "🙈" : "👁️"}
                                        </button>
                                    </div>
                                    {matchError && (
                                        <small className="text-danger">❗ Passwords don't match. Please double-check and try again.</small>
                                    )}
                                </div>

                                <div className="form-group">
                                    <button type="submit" className="btn btn-success w-100" disabled={!isFormValid}>
                                        Set new password
                                    </button>
                                </div>
                            </form>

                            <p className="text-center mb-2">
                                <Link to={"/forget-password"}>I forgot my password</Link>
                            </p>
                            <p className="text-center mt-3">
                                Don't have an account?
                                <Link to="/sign-Up" className="text-primary"> Sign Up</Link>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChangePassword;

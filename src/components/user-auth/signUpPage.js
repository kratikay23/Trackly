import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import apiClient from "../../apiClient";
import API from "../../API";
import { toast } from "react-toastify";
import PasswordField from "../PasswordField";

function SignUp() {
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [contactNo, setContactNo] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState({});
    const [verifyLink, setVerifyLink] = useState(null);
    const [sendGridHint, setSendGridHint] = useState(null);
    const [emailSent, setEmailSent] = useState(false);
    const navigate = useNavigate();
    const [isloading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!userName) newErrors.userName = "User Name is required";
        if (!email) newErrors.email = "Email is required";
        if (!contactNo) newErrors.contactNo = "Contact number is required"
        if (!password) newErrors.password = "Password is required";
        return newErrors;
    };

    const handleSubmit = async (event) => {
        try {
            setIsLoading(true)
            event.preventDefault();
            setVerifyLink(null);
            setSendGridHint(null);
            setEmailSent(false);
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors)
            } else {
                const response = await apiClient.post(API.SIGN_UP, { userName, email, contactNo, password });
                const devLink = response.data?.devVerifyLink;

                if (devLink) {
                    setVerifyLink(devLink);
                    setSendGridHint(response.data?.sendGridHint || null);
                    setEmailSent(false);
                    toast.warn("Account created. Verify using the button below (email could not be sent).");
                } else {
                    setEmailSent(true);
                    toast.success(response.data?.message || "Check your inbox to verify, then sign in.");
                    setTimeout(() => navigate("/sign-in"), 2000);
                }
            }

        } catch (error) {
            const data = error.response?.data;
            let message = data?.message || "Sign up failed. Please check your details.";
            const err = data?.error;
            if (Array.isArray(err)) {
                message = err.map((e) => e.msg).filter(Boolean).join(". ") || message;
            } else if (typeof err === "string") {
                message = err;
            }
            toast.error(message);
        }
        setIsLoading(false)

    };

    return <>
        <div className="signup-container d-flex  flex-column flex-md-row">
            <div className="left-section d-none d-md-block">
                <img
                    src="https://img.freepik.com/free-vector/tiny-people-using-mobile-application-with-map-outdoors_74855-7881.jpg?semt=ais_hybrid&w=740"
                    alt="illustration"
                    className="img-fluid"
                    style={{ opacity: "50%" }}
                />
            </div>

            <div className="right-section d-flex flex-column justify-content-center align-items-center p-4" >
                <div className="w-100 text-start mb-3">
                    <span role="button" onClick={() => navigate(-1)} className="text-primary">
                        ← Back
                    </span>
                </div>
                {isloading ? <div className="spinner-border" ></div> :
                    <div className="form-box">

                        <div className="text-center mb-4">
                            <img src="/assets/logo.png" alt="Logo" height="40" />
                        </div>
                        <h4 className="text-center mb-3">Create an account</h4>

                        {verifyLink && (
                            <div className="alert alert-warning mb-3">
                                <strong>Email not sent.</strong>
                                {sendGridHint ? (
                                    <p className="small mb-2 mt-1">{sendGridHint}</p>
                                ) : (
                                    <span> Configure SendGrid in backend <code>.env</code> and restart the server.</span>
                                )}
                                <div className="mt-2 d-grid gap-2">
                                    <a href={verifyLink} className="btn btn-success btn-sm">
                                        Verify my account now
                                    </a>
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={() => {
                                            navigator.clipboard?.writeText(verifyLink);
                                            toast.info("Verify link copied.");
                                        }}
                                    >
                                        Copy verify link
                                    </button>
                                    <Link to="/sign-in" className="btn btn-link btn-sm">
                                        Go to Sign In after verifying
                                    </Link>
                                </div>
                            </div>
                        )}

                        {emailSent && (
                            <div className="alert alert-success mb-3">
                                Verification email sent. Check your inbox (and spam), then sign in.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}   >
                            <div className="form-group">
                                <small className="text-secondary">User Name</small>
                                <input onChange={(event) => setUserName(event.target.value)} type="text" className={`form-control ${errors.userName ? 'is-invalid' : ''}`} />
                                {errors.userName && <small className="invalid-feedback">{errors.userName}</small>}
                            </div>
                            <div className="form-group">
                                <small className="text-secondary" >Email Id</small>
                                <input onChange={(event) => setEmail(event.target.value)} type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                                {errors.email && <small className="invalid-feedback" >{errors.email}</small>}
                            </div>
                            <div className="form-group">
                                <small className="text-secondary">Contact Number</small>
                                <input onChange={(event) => setContactNo(event.target.value)} type="text" className={`form-control ${errors.contactNo ? 'is-invalid' : ''}`} />
                                {errors.contactNo && <small className="invalid-feedback">{errors.contactNo}</small>}
                            </div>
                            <div className="form-group">
                                <small className="text-secondary">Password</small>
                                <PasswordField
                                    value={password || ""}
                                    onChange={(event) => setPassword(event.target.value)}
                                    isInvalid={!!errors.password}
                                    autoComplete="new-password"
                                />
                                {errors.password && <small className="invalid-feedback d-block">{errors.password}</small>}
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success w-100">
                                    Sign up
                                </button>
                            </div>
                        </form>
                        <p className="text-center mt-3">
                            Already have an account?
                            <Link to="/sign-in" className="text-primary">Sign in</Link>
                        </p>
                    </div>
                }
            </div>
        </div>


    </>
}

export default SignUp;

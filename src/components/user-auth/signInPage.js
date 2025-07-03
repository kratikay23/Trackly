import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import { useDispatch } from "react-redux"
import API from "../../API";
import { setUser } from "../react-redux/UserSlice";
import { signInWithPopup } from "firebase/auth";
import { auths, googleProvider } from "../../Firebase/firebase.js";
import { jwtDecode } from "jwt-decode";

function SignIn() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [isloading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        if (!password) newErrors.password = "Password is required";
        return newErrors;
    };
    const dispatch = useDispatch();

    // const handleSubmit = async (event) => {
    //     try {
    //         setIsLoading(true)
    //         event.preventDefault();
    //         const validationErrors = validate();
    //         if (Object.keys(validationErrors).length > 0) {
    //             setErrors(validationErrors);
    //         } else {
    //             let response = await axios.post(API.SIGN_IN, { email, password })
    //             console.log(response.data);
    //             const { token } = response.data;
    //             dispatch(setUser({ user: { email }, token }));
    //             navigate("/");
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         alert(error.response?.data?.message || "Login Failed. Please try again.");
    //     }
    //     setIsLoading(false)

    // };
    const handleSubmit = async (event) => {
        try {
            setIsLoading(true);
            event.preventDefault();
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }

            // 1. Login and get token
            const response = await axios.post(API.SIGN_IN, { email, password });
            const { token } = response.data;

            // 2. Decode token to get userId
            const decoded = jwtDecode(token);
            const userId = decoded.userId;

            // 3. Fetch full user data using userId
            const userResponse = await axios.get(`${API.GET_USER_BY_ID}/${userId}`, {
                headers: { Authorization: `${token}` }
            });

            const fullUser = userResponse.data;
            console.log(fullUser);

            // 4. Save to Redux
            dispatch(setUser({ user: fullUser, token }));

            navigate("/profile");

        } catch (error) {
            console.log("Login error:", error); // 👈 Add this
            const message = error.response?.data?.message;
            if (message) {
                alert(message);
            } else {
                alert("Something went wrong. Please try again.");
            }

        }
        setIsLoading(false);
    };


    const signupWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auths, googleProvider);
            const user = result.user;
            console.log("Result", result)

            if (!user) {
                alert("Google sign-in failed. No user info found.");
                return;
            }

            const token = await user.getIdToken();

            const res = await axios.post(API.GOOGLE_SIGN_IN, { token });
            console.log(res.data)
            const picture = user.photoURL;
            if (res.data && res.data.token && res.data.user) {
                const { token: appToken, user: userData } = res.data;
                userData.picture = user.photoURL; // attach picture here
                console.log(user.photoURL)
                dispatch(setUser({ user: userData, token: appToken }));
                navigate("/profile");
            } else {
                console.error("Invalid response from server:", res);
                alert("Google sign-in failed. Please try again.");
            }

        } catch (error) {
            console.error("Google sign-in error:", error);
            alert("Google sign-in failed. Please try again.");
        }
    }



    return <>

        <div className="signup-container d-flex flex-column flex-md-row">
            {/* Left  section */}
            <div className="left-section d-none d-md-block">
                <img
                    src="https://tracking.globemoving.net/assets/website/assets/images/track.jpg"
                    alt="illustration"
                    className="img-fluid"
                    style={{ opacity: "50%" }}
                />
            </div>

            {/* Right form section */}
            <div className="right-section d-flex flex-column justify-content-center align-items-center p-4" >
                <div className="w-100 text-start mb-3">
                    <span role="button" onClick={() => navigate(-1)} className="text-primary">
                        ← Back
                    </span>
                </div>
                {isloading ? <div class="spinner-border" ></div> :

                    <div className="form-box">

                        <div className="text-center mb-4">
                            <img src="/assets/logo.png" alt="Logo" height="40" />
                        </div>
                        <h4 className="text-center mb-3">Sign In</h4>
                        <form onSubmit={handleSubmit}   >
                            <div className="form-group">
                                <small className="text-secondary" >Email Id</small>
                                <input onChange={(event) => setEmail(event.target.value)} type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>
                            <div className="form-group">
                                <small className="text-secondary" >Password</small>
                                <input onChange={(event) => setPassword(event.target.value)} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success w-100">
                                    Sign In
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
                        <hr />
                        <button
                            onClick={() => signupWithGoogle()} style={{ color: "black", backgroundColor: "white" }}
                        >
                            <img
                                src="data:image/png;base64,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"
                                alt="Google"
                                style={{ width: '20px', marginRight: '10px' }}
                            />
                            Sign in with Google
                        </button>
                    </div>
                }
            </div>
        </div>


    </>
}

export default SignIn;

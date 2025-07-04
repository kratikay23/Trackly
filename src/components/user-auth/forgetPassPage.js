import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import API from "../../API";

function ForgetPassword() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const [isloading, setIsLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email is required";
        return newErrors;
    };

    const handleSubmit = async (event) => {
        try {
            setIsLoading(true)
            event.preventDefault();
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
            } else {
                let response = await axios.post(API.FORGET_PASSWORD, { email})
                console.log(response.data);
                navigate("/");
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)

    };

    return <>
        {isloading ? <div class="spinner-border" ></div> :
            <div className="signup-container d-flex flex-column flex-md-row">
                {/* Left  section */}
                <div className="left-section d-none d-md-block">
                    <img
                        src="https://res.cloudinary.com/madimages/image/fetch/q_100,f_auto,w_793,h_502/https://s3.amazonaws.com/mobileappdaily/mad/uploads/mad_blog_5ddf7cfcc5bfc1574927612.jpg"
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
                    <div className="form-box">

                        <div className="text-center mb-4">
                            <img src="/assets/logo.png" alt="Logo" height="40" />
                        </div>
                        <h4 className="text-center mb-3">Recover your password</h4>
                        <p className="text-center mb-3"><b>Enter the email</b> that you used when you signed up to recover your password. You will receive a <b>password reset link.</b></p>
                        <form onSubmit={handleSubmit}   >
                            <div className="form-group">
                                <small className="text-secondary" >Email Id</small>
                                <input onChange={(event) => setEmail(event.target.value)} type="text" className={`form-control ${errors.email ? 'is-invalid' : ''}`} />
                                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-success w-100">
                                    Enter
                                </button>
                            </div>
                        </form>
                        <p className="text-center mb-2">
                            <Link to={"/forget-password"}>I forgot my password</Link>
                        </p>
                        <p className="text-center mt-3">
                            Don't have an account?
                            <Link to="/sign-Up" className="text-primary">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        }

    </>
}

export default ForgetPassword;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUp.css";
import axios from "axios";
import API from "../../API";

function SignUp() {
    const [userName, setUserName] = useState();
    const [email, setEmail] = useState();
    const [contactNo, setContactNo] = useState();
    const [password, setPassword] = useState();
    const [errors, setErrors] = useState({});
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
            const validationErrors = validate();
            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors)
            } else {
                let response = await axios.post(API.SIGN_UP, { userName, email, contactNo, password })
                console.log(response.data);
                navigate("/")
            }

        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)

    };

    return <>
        <div className="signup-container d-flex  flex-column flex-md-row">
            {/* Left  section */}
            <div className="left-section d-none d-md-block">
                <img
                    src="https://img.freepik.com/free-vector/tiny-people-using-mobile-application-with-map-outdoors_74855-7881.jpg?semt=ais_hybrid&w=740"
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
                        <h4 className="text-center mb-3">Create an account</h4>
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
                                <small className="text-secondary" >Password</small>
                                <input onChange={(event) => setPassword(event.target.value)} type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} />
                                {errors.password && <small className="invalid-feedback">{errors.password}</small>}
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-success w-100">
                                    Sign up
                                </button>
                            </div>
                        </form>
                        <p className="text-center mt-3">
                            Already have an account?
                            <Link to="/sign-In" className="text-primary">Sign in</Link>
                        </p>
                    </div>
                }
            </div>
        </div>


    </>
}

export default SignUp;

import React from "react";
import Map from "../components/map";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="trackly-page dash-page">
            <Navbar />
            <div className="trackly-page-content dash-page-content">
                <section className="card dash-panel border-0 shadow-sm">
                    <div className="row align-items-center g-3 g-md-4">
                        <div className="col-12 col-md-6 text-center text-md-start">
                            <img
                                src="https://miro.medium.com/v2/resize:fit:1252/0*aTTH9hc1_7JvCl-a.png"
                                alt="Family Tracking"
                                className="img-fluid dash-welcome-img"
                            />
                        </div>
                        <div className="col-12 col-md-6">
                            <h3 className="dash-welcome-title">Welcome to Trackly</h3>
                            <p className="text-muted mb-0">
                                Stay connected and protected with real-time location sharing and SOS alerts.
                            </p>
                        </div>
                    </div>
                </section>

                <section id="sos" className="card dash-panel border-0 shadow-sm">
                    <h5 className="mb-2">Emergency SOS Alert System</h5>
                    <p className="text-muted">
                        In case of emergency, press the SOS button below to instantly send an alert to your trusted contacts with your live location.
                    </p>
                    <div className="d-flex align-items-center mb-3 dash-sos-row">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
                            alt="SOS"
                            className="dash-sos-icon"
                        />
                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => navigate("/sos-alert")}
                        >
                            Send SOS Alert
                        </button>
                    </div>
                    <small className="text-muted">
                        Make sure location permissions are enabled for real-time tracking.
                    </small>
                </section>

                <section className="card dash-panel border-0 shadow-sm">
                    <h5 className="mb-3">Live Tracking</h5>
                    <Map />
                    <p className="mt-3 mb-0 text-muted dash-map-caption">
                        Track your loved ones in real time with accuracy and confidence. This map helps you
                        monitor their movement in case of emergency or routine tracking.
                    </p>
                </section>
            </div>

            <section className="trackly-hero-section text-white">
                <img
                    src="https://www.shutterstock.com/image-vector/destinations-isometric-gps-tracking-map-260nw-2397316607.jpg"
                    alt=""
                    className="trackly-hero-banner"
                />
                <div className="trackly-hero-overlay">
                    <h2>About Trackly</h2>
                    <p>
                        Trackly is your personal safety and family location tracking app. It keeps you connected with loved ones,
                        lets you send instant SOS alerts, and track locations in real-time.
                    </p>
                    <p className="mb-0">Stay safe, stay connected — wherever life takes you.</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Dashboard;

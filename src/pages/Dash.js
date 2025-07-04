import React from "react";
import Map from "../components/map";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navBar";

const Dashboard = () => {
    const navigate = useNavigate();
    return <>
        <Navbar/>
        <div >
            <div className="container py-4">
                <div className="card p-4 border-0 shadow-sm">
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <img
                                src="/assets/family-img.png"
                                alt="Family Tracking"
                                className="img-fluid"
                            />


                        </div>
                        <div className="col-md-6">
                            <h3>Welcome to Trackly</h3>
                            <p className="text-muted">
                                Stay connected and protected with real-time location sharing and SOS alerts.
                            </p>
                            {/* <a href="#sos" className="btn btn-primary">
                                View Location & SOS Details
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* SOS Section */}
            <div id="sos" className="container py-4">
                <div className="card p-4 border-0 shadow-sm">
                    <h5>Emergency SOS Alert System</h5>
                    <p className="text-muted">
                        In case of emergency, press the SOS button below to instantly send an alert to your trusted contacts with your live location.
                    </p>
                    <div className="d-flex align-items-center mb-3">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
                            alt="SOS"
                            style={{ width: "50px", height: "50px", marginRight: "15px" }}
                        />
                        <button className="btn btn-danger" onClick={()=>navigate("/sos-alert")}>🔴 Send SOS Alert</button>
                    </div>
                    <small className="text-muted">
                        Make sure location permissions are enabled for real-time tracking.
                    </small>
                </div>
            </div>

            {/* Live Map Section */}
            <div className="container py-4">
                <div className="card p-4 border-0 shadow-sm">
                    <h5 className="mb-3">Live Tracking</h5>
                    <Map />
                    <p className="mt-3 text-muted">
                        Track your loved ones in real time with accuracy and confidence. This map helps you
                        monitor their movement in case of emergency or routine tracking.
                    </p>
                </div>
            </div>
        </div>
        <div className="text-white mt-3" style={{ position: 'relative' }}>
            <img
                src="/assets/bg-img.png"
                width="100%"
                alt="bg-img"
                style={{ objectFit: 'cover', height: '400px', filter: 'brightness(40%)' }}
            />

            {/* ✅ Fix: Positioned over the image using normal flow */}
            <div
                className="text-center text-white px-3"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'rgba(148, 175, 248, 0.4)'
                }} >
                <h2 style={{ fontWeight: 'bold' }}>About Trackly</h2>
                <p className="mx-auto" style={{ maxWidth: '700px' }}>
                    Trackly is your personal safety and family location tracking app. It keeps you connected with loved ones,
                    lets you send instant SOS alerts, and track locations in real-time.
                </p>
                <p>Stay safe, stay connected — wherever life takes you.</p>
            </div>
        </div>
        <Footer />
    </>
};

export default Dashboard;


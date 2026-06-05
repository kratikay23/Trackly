import { Link } from "react-router-dom";
import { FaLinkedin } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa6";

const Footer = () => {
    return (
        <footer className="trackly-footer mt-auto">

            <div className="bg-dark text-white pt-4 pb-2" style={{ fontFamily: 'sans-serif' }}>
                <div className="container-fluid container-lg">
                    <div className="row border-bottom pb-3 mb-3">
                        <div className="col-12 col-md-3 mb-3 d-flex align-items-center">
                            <img src="/assets/logo.png" alt="Trackly" width="30" height="30" className="me-2" />
                            <h5 className="m-0">Trackly</h5>
                        </div>

                        <div className="col-12 col-md-6 footer-links-row">
                            <div>
                                <h6>Content</h6>
                                <ul className="list-unstyled">
                                    <li><Link to="/sos-alert" className="text-white text-decoration-none">SOS Alert</Link></li>
                                    <li><Link to="/family-tracker" className="text-white text-decoration-none">Family Tracker</Link></li>
                                    <li><Link to="/emg-contacts" className="text-white text-decoration-none">Emergency Contact</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h6>Help</h6>
                                <ul className="list-unstyled">
                                    <li><Link to="/support" className="text-white text-decoration-none">Support</Link></li>
                                    <li><Link to="/faqs" className="text-white text-decoration-none">FAQs</Link></li>
                                    <li><Link to="/follow-us" className="text-white text-decoration-none">Follow</Link></li>
                                    <li><Link to="/company" className="text-white text-decoration-none">Company</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h6>About</h6>
                                <ul className="list-unstyled">
                                    <li><Link to="/contact-us" className="text-white text-decoration-none">Contact us</Link></li>
                                    <li><Link to="/our-license" className="text-white text-decoration-none">Our license</Link></li>
                                    <li><Link to="/blog" className="text-white text-decoration-none">Blog</Link></li>
                                    <li><Link to="/plans-and-pricing" className="text-white text-decoration-none">Plans and Pricing</Link></li>
                                    <li><Link to="/whats-new" className="text-white text-decoration-none">What's new</Link></li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-md-3 mb-3">
                            <h6>Social Media</h6>
                            <div className="d-flex gap-2 mt-2" style={{ fontSize: '20px', cursor: 'pointer', gap: '10px' }}>
                                <a href="https://www.linkedin.com/in/trackly-traker-4a9560414/" target="_blank" rel="noreferrer" className="text-white text-decoration-none" aria-label="LinkedIn"><FaLinkedin /></a>
                                <a href="https://x.com/tracksafety" target="_blank" rel="noreferrer" className="text-white text-decoration-none" aria-label="X"><FaX /></a>
                                <a href="https://www.instagram.com/tracksafety/" target="_blank" rel="noreferrer" className="text-white text-decoration-none" aria-label="Instagram"><FaInstagram /></a>
                                <a href="https://www.facebook.com/tracksafety/" target="_blank" rel="noreferrer" className="text-white text-decoration-none" aria-label="Facebook"><FaFacebook /></a>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom d-flex justify-content-between flex-wrap text-white-50 small">
                        <div>Copyright © 2026 mySafty | Designed by Trackly and team</div>
                        <div>
                            <Link to="/privacy-policy" className="text-white text-decoration-underline me-2">Privacy Policy</Link>|
                            <Link to="/terms-and-conditions" className="text-white text-decoration-underline ms-2">Terms & Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

const Footer = () => {
    return (
        <footer >

            <div className="bg-dark text-white pt-4 pb-2" style={{ fontFamily: 'sans-serif' }}>
                <div className="container">
                    <div className="row border-bottom pb-3 mb-3">
                        {/* Logo */}
                        <div className="col-md-3 mb-3 d-flex align-items-center">
                            <img src="/assets/logo.png" alt="Trackly" width="30" height="30" className="me-2" />
                            <h5 className="m-0">Trackly</h5>
                        </div>

                        {/* Footer Links */}
                        <div className="col-md-6 d-flex justify-content-between">
                            <div>
                                <h6>Content</h6>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="text-white text-decoration-none">SOS Alert</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Family Tracker</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Emergency Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h6>Help</h6>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="text-white text-decoration-none">Support</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">FAQs</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Follow</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Company</a></li>
                                </ul>
                            </div>
                            <div>
                                <h6>About</h6>
                                <ul className="list-unstyled">
                                    <li><a href="#" className="text-white text-decoration-none">Contact us</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Our license</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Blog</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">Plans and Pricing</a></li>
                                    <li><a href="#" className="text-white text-decoration-none">What's new</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="col-md-3 mb-3">
                            <h6>Social Media</h6>
                            <div className="d-flex gap-2 mt-2">
                                <img src="/assets/linkedin.png" alt="LinkedIn" width="24" height="24" />
                                <img src="/assets/x.png" alt="X" width="24" height="24" />
                                <img src="/assets/instagram.png" alt="Instagram" width="24" height="24" />
                                <img src="/assets/facebook.png" alt="Facebook" width="24" height="24" />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="d-flex justify-content-between flex-wrap text-white-50 small">
                        <div>Copyright © 2025 mySafty | Diseños by Trackly and team</div>
                        <div>
                            <a href="#" className="text-white text-decoration-underline me-2">Privacy Policy</a>|
                            <a href="#" className="text-white text-decoration-underline ms-2">Terms & Service</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

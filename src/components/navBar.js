import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BellIcon, HomeIcon, MapPinIcon, Menu, PhoneIcon, UserIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import SosAlertModal from '../pages/SOSALertModel';

const Navbar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef();
    const [showSOSModal, setShowSOSModal] = useState(false);

    const { user } = useSelector((state) => state.userData);

    const handleSOSClick = () => {
        if (!user) {
            navigate("/sign-in");
        } else {
            setShowSOSModal(true);
            setOpen(false); // close dropdown
        }
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const firstLetter = user?.userName?.[0]?.toUpperCase() || "";
    const profilePicture = user?.photoURL || user?.picture;

    

    return (
        <>
            <div className="trackly-navbar d-flex justify-content-between align-items-center mb-4 fixed-top border bg-white">
                <div className="position-relative" ref={menuRef}>
                    <button className="btn btn-outline-secondary" onClick={() => setOpen(!open)}>
                        <Menu />
                    </button>
                    {open && (
                        <div className="trackly-nav-dropdown position-absolute bg-white border rounded p-2 shadow">
                            <Link to="/profile" className="dropdown-item" onClick={() => setOpen(false)}>
                                <UserIcon className='icon' /> Profile</Link>
                            <Link to="/" className="dropdown-item" onClick={() => setOpen(false)}>
                                <HomeIcon className='icon' /> Dashboard
                            </Link>

                            {/* SOS as button */}
                            <button
                                className="dropdown-item bg-transparent border-0 text-start w-100 hover:bg-gray-100"
                                onClick={handleSOSClick}
                            >
                                <BellIcon className='icon' /> SOS
                            </button>

                            <Link to="/family-tracker" className="dropdown-item" onClick={() => setOpen(false)}>
                                <MapPinIcon className='icon' /> Family Tracker</Link>
                            <Link to="/emg-contacts" className="dropdown-item" onClick={() => setOpen(false)}>
                                <PhoneIcon className='icon' /> Emergency Contacts</Link>
                        </div>
                    )}
                </div>

                <div className="d-flex">
                    <img src="/assets/logo.png" alt="menu" width="30px" height="30px" className="cursor-pointer" />
                    <span className="trackly-brand-text text-black fw-bold ms-2">Trackly</span>
                </div>

                <div className="d-flex align-items-center">
                    {user?.userName ? (
                        profilePicture ? (
                            <img onClick={() => navigate("/profile")} src={profilePicture} alt="profile" width="35px" height="35px" style={{ borderRadius: "50%", cursor: "pointer" }} />
                        ) : (
                            <div onClick={() => navigate("/profile")} className="d-flex justify-content-center align-items-center rounded-circle bg-primary text-white fw-bold" style={{ width: "35px", height: "35px", cursor: "pointer" }} title={user.userName}>
                                {firstLetter}
                            </div>
                        )
                    ) : (
                        <img onClick={() => navigate("/sign-In")} src="/assets/profile-icon.png" alt="menu" width="30px" height="30px" className="cursor-pointer" />
                    )}
                </div>
            </div>

            {/*  Render SOS modal OUTSIDE dropdown */}
            {showSOSModal && <SosAlertModal onClose={() => setShowSOSModal(false)} />}
        </>
    );
};

export default Navbar;

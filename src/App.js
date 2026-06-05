import { Route, Routes } from 'react-router-dom';
import './App.css';
import './styles/trackly-responsive.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dash.js';
import SignIn from './components/user-auth/signInPage.js';
import SignUp from './components/user-auth/signUpPage.js';
import Profile from './pages/Profile.js';
import EmergencyContactsPage from './pages/EmergencyContactPage.js';
import FamilyTrackerPage from './pages/FamilyTrackerPage.js';
import FamilyMap from './components/familyMap.js';
import FamilyGroupChat from './components/FamilyGroup.js';
import RightSide from './pages/FamilyTrackerRightSide.js';
import ProtectedRoute from './components/user-auth/authentication.js';
import SosAlertRoute from './pages/SosAlertRoute.js';
import ForgetPassword from './components/user-auth/forgetPassPage.js';
import ResetPasswordPage from './pages/ResetPasswordPage.js';
import AuthBootstrap from './components/user-auth/AuthBootstrap.js';
import FooterContentPage from './pages/footer/FooterContentPage.js';
import { footerRoutes } from './pages/footer/footerContent.js';

function App() {
    return <>
        <AuthBootstrap>
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path='/sos-alert' element={<SosAlertRoute />} />
                <Route path='/emg-contacts' element={<EmergencyContactsPage />} />
                <Route path='/family-tracker' element={<FamilyTrackerPage />} >
                    <Route index element={<RightSide />} />
                    <Route path='live-map' element={<FamilyMap />} />
                    <Route path='family-group' element={<FamilyGroupChat />}>
                    </Route>
                </Route>
            </Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            {footerRoutes.map(({ key, path }) => (
                <Route key={path} path={path} element={<FooterContentPage pageKey={key} />} />
            ))}
        </Routes>
        </AuthBootstrap>
        <ToastContainer
            position="top-right"
            autoClose={3000}
            limit={3}
            style={{ top: "var(--trackly-nav-height, 72px)" }}
        />
    </>

}

export default App;

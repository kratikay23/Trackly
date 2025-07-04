import { Route, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dash.js';
import SignIn from './components/user-auth/signInPage.js';
import SignUp from './components/user-auth/signUpPage.js';
import Profile from './pages/Profile.js';
import EmergencyContactsPage from './pages/EmergencyContactPage.js';
import FamilyTrackerPage from './pages/FamilyTrackerPage.js';
import FamilyMap from './components/familyMap.js';
import GroupChatBox from './components/GroupChatBox.js';
import FamilyGroupChat from './components/FamilyGroup.js';
import RightSide from './pages/FamilyTrackerRightSide.js';
import ProtectedRoute from './components/user-auth/authentication.js';
import SosAlertModal from './pages/SOSALertModel.js';
import ForgetPassword from './components/user-auth/forgetPassPage.js';
import ChangePassword from './components/user-auth/ChangePassword.js';

function App() {
    return <>
        <Routes>
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path='/sos-alert' element={<SosAlertModal />} />
                <Route path='/emg-contacts' element={<EmergencyContactsPage />} />
                <Route path='/family-tracker' element={<FamilyTrackerPage />} >
                    <Route index element={<RightSide />} />
                    <Route path='live-map' element={<FamilyMap />} />
                    <Route path='family-group' element={<FamilyGroupChat />}>
                    </Route>
                </Route>
                <Route path='/chat-box' element={<GroupChatBox />} />
            </Route>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path='/reset-password' element={<ChangePassword />} />



        </Routes>
    </>

}

export default App;

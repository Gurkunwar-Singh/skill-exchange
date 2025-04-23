import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MainSite from './pages/MainSite';
import './index.css';
import ProtectedRoute from './components/ProtectedRoute';
import ProfileCreation from './pages/ProfileForm';
import Dashboard from './pages/Dashboard';
import MilestoneTracker from './pages/MilestoneTracker';
import TeamBuilder from './pages/TeamBuilder'
import Agreement from './pages/AgreementForm'
const App = () => {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/signup" element={<SignupPage />} />

  {/* Protected Routes */}
  <Route element={<ProtectedRoute />}>
    <Route path="/main" element={<MainSite />} />
    <Route path="/profile" element={<ProfileCreation/>} />
    <Route path="/dashboard" element={<Dashboard/>} />
    {/* <Route path="/milestone" element={<Dashboard/>} /> */}
    <Route path="/team" element={<TeamBuilder/>} />
    <Route path="/agreement" element={<Agreement/>} />
    <Route path="/milestone" element={<MilestoneTracker tradeId="662fe6bb8cf4b8348c4a7551" />}/>
  </Route>
</Routes>
    </Router>
   
  );
};

export default App;

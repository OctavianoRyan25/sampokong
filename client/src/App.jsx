import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import PaymentPage from './pages/PaymentPage';
import TourPage from './pages/TourPage';
import './i18n';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route
          path="/tour"
          element={
            <ProtectedRoute>
              <TourPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import { checkPaymentStatus, formatTimeRemaining } from '../utils/payment';

function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateTimer = () => {
      const status = checkPaymentStatus();
      if (status.isValid) {
        setShowTimer(true);
        setTimeRemaining(formatTimeRemaining(status.remainingMs));
      } else {
        setShowTimer(false);
        setTimeRemaining('');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [location.pathname]);

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner">
        <div
          className="navbar-logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
          id="navbar-logo"
        >
          <span className="navbar-logo-icon">🏮</span>
          <span className="navbar-logo-text">三保公</span>
        </div>

        <div className="navbar-actions">
          {showTimer && (
            <div className="navbar-timer" id="navbar-timer">
              <span className="navbar-timer-icon">⏱️</span>
              <span>{timeRemaining}</span>
            </div>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

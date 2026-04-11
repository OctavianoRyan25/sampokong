import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkPaymentStatus } from '../utils/payment';

function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const status = checkPaymentStatus();
    if (status.isValid) {
      // Payment still valid, could auto-redirect
    }
  }, []);

  const handleStartTour = () => {
    const status = checkPaymentStatus();
    if (status.isValid) {
      navigate('/tour');
    } else {
      navigate('/payment');
    }
  };

  const { isValid } = checkPaymentStatus();

  return (
    <div id="landing-page">
      {/* Hero Section */}
      <section className="hero">
        {/* Floating lantern decorations */}
        <span className="lantern lantern-1">🏮</span>
        <span className="lantern lantern-2">🏮</span>
        <span className="lantern lantern-3">🏮</span>
        <span className="lantern lantern-4">🏮</span>
        <span className="lantern lantern-5">🏮</span>

        <div className="hero-content">
          <div className="hero-badge">
            <span>🐉</span>
            <span>{t('landing.subtitle')}</span>
          </div>

          <p className="hero-welcome">{t('landing.welcome')}</p>
          <h1 className="hero-title">{t('landing.title')}</h1>
          <p className="hero-description">{t('landing.description')}</p>

          <div className="hero-actions">
            <button
              className="btn btn-gold btn-lg"
              onClick={handleStartTour}
              id="start-tour-btn"
            >
              {isValid ? (
                <>🎯 {t('landing.alreadyPaid')}</>
              ) : (
                <>🎫 {t('landing.startTour')}</>
              )}
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-icon">🏛️</span>
              <p className="hero-stat-text">{t('landing.history')}</p>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon">👥</span>
              <p className="hero-stat-text">{t('landing.visitors')}</p>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-icon">📍</span>
              <p className="hero-stat-text">{t('landing.destinations')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="divider">
          <span className="divider-icon">☯</span>
        </div>

        <div className="features-grid">
          <div className="glass-card feature-card">
            <span className="feature-icon">🎥</span>
            <h3 className="feature-title">{t('landing.feature1Title')}</h3>
            <p className="feature-desc">{t('landing.feature1Desc')}</p>
          </div>

          <div className="glass-card feature-card">
            <span className="feature-icon">📡</span>
            <h3 className="feature-title">{t('landing.feature2Title')}</h3>
            <p className="feature-desc">{t('landing.feature2Desc')}</p>
          </div>

          <div className="glass-card feature-card">
            <span className="feature-icon">🌏</span>
            <h3 className="feature-title">{t('landing.feature3Title')}</h3>
            <p className="feature-desc">{t('landing.feature3Desc')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;

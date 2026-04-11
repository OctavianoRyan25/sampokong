import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { checkPaymentStatus, savePayment, generateUniqueKey } from '../utils/payment';

function PaymentPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [snapLoaded, setSnapLoaded] = useState(false);

  // Redirect if already paid
  useEffect(() => {
    const status = checkPaymentStatus();
    if (status.isValid) {
      navigate('/tour', { replace: true });
    }
  }, [navigate]);

  // Load Midtrans Snap.js
  useEffect(() => {
    const snapUrl = import.meta.env.VITE_MIDTRANS_SNAP_URL;
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    if (!snapUrl || !clientKey) {
      console.warn('Midtrans config not set, using mock payment');
      return;
    }

    const existingScript = document.querySelector(`script[src="${snapUrl}"]`);
    if (existingScript) {
      setSnapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = snapUrl;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    script.onload = () => setSnapLoaded(true);
    script.onerror = () => console.error('Failed to load Midtrans Snap');
    document.head.appendChild(script);

    return () => {
      // Don't remove on cleanup to avoid re-loading
    };
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setMessage(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      // Try to get token from backend
      const response = await fetch(`${apiUrl}/api/create-transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 15000,
          item_name: 'Sam Poo Kong Digital Tour',
        }),
      });

      if (response.ok) {
        const data = await response.json();

        if (window.snap && data.token) {
          // Use Midtrans Snap
          window.snap.pay(data.token, {
            onSuccess: (result) => {
              handlePaymentSuccess(data.order_id);
            },
            onPending: (result) => {
              setMessage({ type: 'pending', text: t('payment.pending') });
              setLoading(false);
            },
            onError: (result) => {
              setMessage({ type: 'error', text: t('payment.failed') });
              setLoading(false);
            },
            onClose: () => {
              setLoading(false);
            },
          });
          return;
        }
      }

      // Fallback: Mock payment for demo
      await mockPayment();
    } catch (error) {
      console.warn('Backend unavailable, using mock payment:', error.message);
      await mockPayment();
    }
  };

  const mockPayment = async () => {
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const paymentKey = generateUniqueKey();
    handlePaymentSuccess(paymentKey);
  };

  const handlePaymentSuccess = (orderId) => {
    const paymentKey = orderId || generateUniqueKey();
    savePayment(paymentKey);
    setMessage({ type: 'success', text: t('payment.success') });
    setLoading(false);

    // Redirect to tour page after short delay
    setTimeout(() => {
      navigate('/tour', { replace: true });
    }, 1500);
  };

  return (
    <div className="payment-page" id="payment-page">
      <div className="glass-card payment-card">
        <span className="payment-icon">🏯</span>
        <h1 className="payment-title">{t('payment.title')}</h1>
        <p className="payment-subtitle">{t('payment.subtitle')}</p>

        <div className="divider">
          <span className="divider-icon">◆</span>
        </div>

        <div className="payment-price">{t('payment.price')}</div>
        <p className="payment-duration">⏰ {t('payment.duration')}</p>

        <div className="payment-includes">
          <p className="payment-includes-title">{t('payment.includes')}</p>
          <ul className="payment-includes-list">
            <li>{t('payment.include1')}</li>
            <li>{t('payment.include2')}</li>
            <li>{t('payment.include3')}</li>
            <li>{t('payment.include4')}</li>
          </ul>
        </div>

        <button
          className="btn btn-gold btn-lg"
          onClick={handlePayment}
          disabled={loading}
          id="pay-now-btn"
          style={{ width: '100%' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }}></span>
              {t('payment.processing')}
            </>
          ) : (
            <>💳 {t('payment.payNow')}</>
          )}
        </button>

        <div className="payment-secure">
          <span>🔒</span>
          <span>{t('payment.secure')}</span>
        </div>

        {message && (
          <div className={`payment-message ${message.type}`} id="payment-message">
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentPage;

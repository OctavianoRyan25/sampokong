import { Navigate } from 'react-router-dom';
import { checkPaymentStatus } from '../utils/payment';

function ProtectedRoute({ children }) {
  const { isValid } = checkPaymentStatus();

  if (!isValid) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

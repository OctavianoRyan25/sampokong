import { useTranslation } from 'react-i18next';

function GPSStatus({ status, accuracy }) {
  const { t } = useTranslation();

  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          className: 'gps-active',
          dotClass: 'active',
          text: t('tour.gpsActive'),
          icon: '📡',
        };
      case 'searching':
        return {
          className: 'gps-searching',
          dotClass: 'searching',
          text: t('tour.searching'),
          icon: '🔍',
        };
      case 'denied':
        return {
          className: 'gps-inactive',
          dotClass: 'inactive',
          text: t('tour.permissionDenied'),
          icon: '⚠️',
        };
      default:
        return {
          className: 'gps-inactive',
          dotClass: 'inactive',
          text: t('tour.gpsInactive'),
          icon: '📍',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`gps-status ${config.className}`} id="gps-status">
      <span className={`gps-dot ${config.dotClass}`}></span>
      <span>{config.icon} {config.text}</span>
      {accuracy && status === 'active' && (
        <span style={{ opacity: 0.7, fontSize: '0.8rem' }}>
          ({t('tour.accuracy')}: ±{Math.round(accuracy)}{t('tour.meters')})
        </span>
      )}
    </div>
  );
}

export default GPSStatus;

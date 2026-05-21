import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import VideoPlayer from './VideoPlayer';

function DestinationCard({ destination, index, isVisited, onView, autoExpand }) {
  const { t, i18n } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const lang = i18n.language;

  // Auto-expand and mark visited when proximity unlocks this destination
  useEffect(() => {
    if (autoExpand && (destination.isNearby || isVisited)) {
      setExpanded(true);
      if (destination.isNearby && !isVisited && onView) {
        onView(destination.id);
      }
    }
  }, [autoExpand]); // eslint-disable-line react-hooks/exhaustive-deps

  const getName = () => {
    switch (lang) {
      case 'en': return destination.name_en;
      case 'cn': return destination.name_cn;
      default: return destination.name_id;
    }
  };

  const getDescription = () => {
    switch (lang) {
      case 'en': return destination.description_en;
      case 'cn': return destination.description_cn;
      default: return destination.description_id;
    }
  };

  const getStatus = () => {
    if (destination.isNearby) return 'nearby';
    if (isVisited) return 'visited';
    return 'locked';
  };

  const getStatusLabel = () => {
    const status = getStatus();
    return t(`tour.${status}`);
  };

  const handleToggle = () => {
    if (destination.isNearby || isVisited) {
      setExpanded(!expanded);
      if (destination.isNearby && !isVisited && onView) {
        onView(destination.id);
      }
    }
  };

  const status = getStatus();

  return (
    <div
      className={`destination-card ${status}`}
      id={`destination-${destination.id}`}
    >
      <div className="destination-card-header" onClick={handleToggle}>
        <div className={`destination-number ${status}`}>
          {isVisited ? '✓' : index + 1}
        </div>
        <div className="destination-info">
          <div className="destination-name">{getName()}</div>
          {destination.distance !== undefined && (
            <div className="destination-distance">
              {t('tour.distance')}: {destination.distance}m
            </div>
          )}
        </div>
        <span className={`destination-status ${status}`}>
          {getStatusLabel()}
        </span>
      </div>

      {expanded && (destination.isNearby || isVisited) && (
        <div className="destination-content">
          <VideoPlayer url={destination.video_url} title={getName()} autoplay={autoExpand} />
          <div className="destination-description">
            <p>{getDescription()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationCard;

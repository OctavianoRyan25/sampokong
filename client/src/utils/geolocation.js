/**
 * Calculate distance between two coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Start GPS tracking
 * @param {function} onSuccess - Callback with { latitude, longitude, accuracy }
 * @param {function} onError - Error callback
 * @returns {number} watchId for clearing
 */
export function startTracking(onSuccess, onError) {
  if (!("geolocation" in navigator)) {
    onError && onError({ code: 0, message: "Geolocation not supported" });
    return null;
  }

  const options = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000,
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      onError && onError(error);
    },
    options
  );

  return watchId;
}

/**
 * Stop GPS tracking
 * @param {number} watchId - The watch ID from startTracking
 */
export function stopTracking(watchId) {
  if (watchId !== null && watchId !== undefined) {
    navigator.geolocation.clearWatch(watchId);
  }
}

/**
 * Find nearby destinations based on user position
 * @param {number} userLat - User latitude
 * @param {number} userLon - User longitude
 * @param {Array} destinations - Array of destination objects with lat, lng, radius
 * @returns {Array} destinations sorted by distance with distance property added
 */
export function findNearbyDestinations(userLat, userLon, destinations) {
  return destinations
    .map((dest) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        dest.latitude,
        dest.longitude
      );
      return {
        ...dest,
        distance: Math.round(distance),
        isNearby: distance <= dest.radius,
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

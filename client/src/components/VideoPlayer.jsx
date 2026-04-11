function VideoPlayer({ url, title }) {
  if (!url) {
    return (
      <div className="destination-video">
        <div className="video-placeholder">
          <span className="video-placeholder-icon">🎬</span>
          <span>Video tidak tersedia</span>
        </div>
      </div>
    );
  }

  // Check if it's a YouTube URL
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );

  if (youtubeMatch) {
    return (
      <div className="destination-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video URL
  return (
    <div className="destination-video">
      <video controls preload="metadata">
        <source src={url} type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>
    </div>
  );
}

export default VideoPlayer;

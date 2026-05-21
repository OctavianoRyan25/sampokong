import { useRef, useEffect } from 'react';

function VideoPlayer({ url, title, autoplay }) {
  const videoRef = useRef(null);

  // For native <video>, imperatively trigger play() when autoplay becomes true
  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay blocked by browser policy — user can press play manually
      });
    }
  }, [autoplay]);

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
    const params = new URLSearchParams({
      rel: '0',
      ...(autoplay ? { autoplay: '1', mute: '1' } : {}),
    });
    return (
      <div className="destination-video">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}?${params.toString()}`}
          title={title || 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct video URL (uploaded from server)
  return (
    <div className="destination-video">
      <video
        ref={videoRef}
        controls
        preload="metadata"
        muted={!!autoplay}
        autoPlay={!!autoplay}
      >
        <source src={url} type="video/mp4" />
        Browser Anda tidak mendukung tag video.
      </video>
    </div>
  );
}

export default VideoPlayer;

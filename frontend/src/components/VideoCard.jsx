import { useNavigate } from 'react-router-dom'

export default function VideoCard({ video }) {
  const navigate = useNavigate()

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`
    }
    return `${views} views`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/video/${video._id}`)}
    >
      {/* Thumbnail */}
      <div style={styles.thumbnailWrapper}>
        <img
          src={video.thumbnailUrl || `https://picsum.photos/seed/${video._id}/320/180`}
          alt={video.title}
          style={styles.thumbnail}
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${video._id}/320/180`
          }}
        />
      </div>

      {/* Video Info */}
      <div style={styles.info}>
        {/* Channel Avatar */}
        <div style={styles.channelAvatar}>
          {video.channelId?.channelName
            ? video.channelId.channelName.charAt(0).toUpperCase()
            : 'C'}
        </div>

        {/* Text Info */}
        <div style={styles.textInfo}>
          <p style={styles.title}>{video.title}</p>
          <p style={styles.channelName}>
            {video.channelId?.channelName || 'Unknown Channel'}
          </p>
          <p style={styles.meta}>
            {formatViews(video.views)} • {formatDate(video.createdAt)}
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    cursor: 'pointer',
    width: '100%',
    transition: 'transform 0.1s',
  },
  thumbnailWrapper: {
    width: '100%',
    aspectRatio: '16/9',
    borderRadius: '10px',
    overflow: 'hidden',
    background: '#272727',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.2s',
  },
  info: {
    display: 'flex',
    gap: '12px',
    padding: '10px 4px 0',
  },
  channelAvatar: {
    width: '36px',
    height: '36px',
    minWidth: '36px',
    borderRadius: '50%',
    background: '#3ea6ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  textInfo: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    lineHeight: 1.4,
    marginBottom: '4px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  channelName: {
    color: '#aaa',
    fontSize: '13px',
    marginBottom: '2px',
  },
  meta: {
    color: '#aaa',
    fontSize: '12px',
  },
}
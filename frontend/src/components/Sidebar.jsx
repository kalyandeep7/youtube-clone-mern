import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { icon: '🏠', label: 'Home', path: '/' },
  { icon: '🔥', label: 'Trending', path: '/' },
  { icon: '📺', label: 'Subscriptions', path: '/' },
]

const libraryItems = [
  { icon: '📚', label: 'Library', path: '/' },
  { icon: '🕒', label: 'History', path: '/' },
  { icon: '▶️', label: 'Your Videos', path: '/channel' },
]

const exploreItems = [
  { icon: '🎵', label: 'Music', path: '/' },
  { icon: '🎮', label: 'Gaming', path: '/' },
  { icon: '📰', label: 'News', path: '/' },
  { icon: '🏆', label: 'Sports', path: '/' },
]

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  if (!isOpen) return null

  return (
    <aside style={styles.sidebar}>

      {/* Main Menu */}
      <div style={styles.section}>
        {menuItems.map((item) => (
          <div
            key={item.label}
            style={styles.item}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Library */}
      <div style={styles.section}>
        <p style={styles.sectionTitle}>You</p>
        {libraryItems.map((item) => (
          <div
            key={item.label}
            style={styles.item}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Explore */}
      <div style={styles.section}>
        <p style={styles.sectionTitle}>Explore</p>
        {exploreItems.map((item) => (
          <div
            key={item.label}
            style={styles.item}
            onClick={() => navigate(item.path)}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Sign in prompt if not logged in */}
      {!user && (
        <div style={styles.signInSection}>
          <p style={styles.signInText}>
            Sign in to like videos, comment, and subscribe.
          </p>
          <button
            style={styles.signInBtn}
            onClick={() => navigate('/login')}
          >
            👤 Sign In
          </button>
        </div>
      )}

    </aside>
  )
}

const styles = {
  sidebar: {
    width: '240px',
    background: '#0f0f0f',
    height: 'calc(100vh - 56px)',
    position: 'fixed',
    top: '56px',
    left: 0,
    overflowY: 'auto',
    zIndex: 50,
    paddingBottom: '20px',
  },
  section: {
    padding: '8px 0',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '8px 24px 4px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '10px 24px',
    color: '#fff',
    cursor: 'pointer',
    borderRadius: '10px',
    margin: '0 8px',
    fontSize: '14px',
    transition: 'background 0.1s',
  },
  icon: {
    fontSize: '18px',
    width: '24px',
    textAlign: 'center',
  },
  label: {
    fontSize: '14px',
  },
  divider: {
    height: '1px',
    background: '#272727',
    margin: '8px 0',
  },
  signInSection: {
    padding: '16px 24px',
  },
  signInText: {
    color: '#aaa',
    fontSize: '13px',
    lineHeight: 1.5,
    marginBottom: '12px',
  },
  signInBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: '1px solid #3ea6ff',
    background: 'transparent',
    color: '#3ea6ff',
    cursor: 'pointer',
    fontSize: '14px',
  },
}
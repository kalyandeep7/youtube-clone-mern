import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Header({ onToggleSidebar, onSearch }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header style={styles.header}>

      {/* Left - Hamburger + Logo */}
      <div style={styles.left}>
        <button onClick={onToggleSidebar} style={styles.menuBtn}>
          ☰
        </button>
        <div style={styles.logo} onClick={() => navigate('/')}>
          <span style={styles.logoIcon}>▶</span>
          <span style={styles.logoText}>
            <span style={{ color: '#ff0000' }}>You</span>Tube
          </span>
        </div>
      </div>

      {/* Center - Search Bar */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          className="search-input"
          style={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
        />
        <button
          type="submit"
          className="search-btn"
          style={styles.searchBtn}
        >
          🔍
        </button>
      </form>

      {/* Right - Auth Buttons */}
      <div style={styles.right}>
        {user ? (
          <>
            <div style={styles.avatar}>
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span style={styles.username}>{user.username}</span>
            <button
              style={styles.channelBtn}
              onClick={() => navigate('/channel')}
            >
              My Channel
            </button>
            <button style={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <button
            style={styles.signInBtn}
            onClick={() => navigate('/login')}
          >
            👤 Sign In
          </button>
        )}
      </div>

    </header>
  )
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#0f0f0f',
    padding: '8px 16px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    borderBottom: '1px solid #272727',
    height: '56px',
  },
  left: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  logoIcon: {
    background: '#ff0000',
    color: '#fff',
    padding: '4px 6px',
    borderRadius: '4px',
    fontSize: '14px',
  },
  logoText: {
    color: '#fff',
    fontSize: '18px',
    fontWeight: 'bold',
    letterSpacing: '-0.5px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    maxWidth: '600px',
    margin: '0 20px',
  },
  searchInput: {
    flex: 1,
    padding: '8px 16px',
    borderRadius: '20px 0 0 20px',
    border: '1px solid #333',
    borderRight: 'none',
    background: '#121212',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  searchBtn: {
    padding: '8px 16px',
    borderRadius: '0 20px 20px 0',
    border: '1px solid #333',
    background: '#272727',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#3ea6ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  username: {
    color: '#fff',
    fontSize: '14px',
  },
  channelBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #3ea6ff',
    background: 'transparent',
    color: '#3ea6ff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  logoutBtn: {
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid #555',
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
  signInBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #3ea6ff',
    background: 'transparent',
    color: '#3ea6ff',
    cursor: 'pointer',
    fontSize: '14px',
  },
}
import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import FilterBar from '../components/FilterBar'
import VideoCard from '../components/VideoCard'
import axios from '../api/axios'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [videos, setVideos] = useState([])
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [category, search])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const params = {}
      if (category !== 'All') params.category = category
      if (search) params.search = search
      const { data } = await axios.get('/videos', { params })
      setVideos(data)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query) => {
    setSearch(query)
    setCategory('All')
  }

  const handleCategorySelect = (cat) => {
    setCategory(cat)
    setSearch('')
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <Header
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onSearch={handleSearch}
      />

      <div style={styles.body}>

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <main
          style={{
            ...styles.main,
            marginLeft: sidebarOpen ? '240px' : '0',
          }}
        >
          {/* Filter Bar */}
          <FilterBar
            selected={category}
            onSelect={handleCategorySelect}
          />

          {/* Search result label */}
          {search && (
            <div style={styles.searchLabel}>
              <p style={styles.searchText}>
                Search results for: <span style={{ color: '#fff' }}>"{search}"</span>
              </p>
              <button
                style={styles.clearBtn}
                onClick={() => handleSearch('')}
              >
                Clear
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div style={styles.centered}>
              <p style={styles.loadingText}>Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div style={styles.centered}>
              <p style={styles.noVideosText}>No videos found</p>
            </div>
          ) : (
            <div
              className="video-grid"
              style={styles.grid}
            >
              {videos.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: '#0f0f0f',
    minHeight: '100vh',
  },
  body: {
    display: 'flex',
  },
  main: {
    flex: 1,
    transition: 'margin-left 0.2s ease',
    minHeight: 'calc(100vh - 56px)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    padding: '16px',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  loadingText: {
    color: '#aaa',
    fontSize: '16px',
  },
  noVideosText: {
    color: '#aaa',
    fontSize: '16px',
  },
  searchLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px 0',
  },
  searchText: {
    color: '#aaa',
    fontSize: '14px',
  },
  clearBtn: {
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #555',
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
}
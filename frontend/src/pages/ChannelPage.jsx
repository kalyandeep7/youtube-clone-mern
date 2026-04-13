import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

const CATEGORIES = [
  'Web Development',
  'JavaScript',
  'Data Structures',
  'Server',
  'Information Technology',
  'Programming',
  'Gaming',
  'Music',
  'News',
  'Sports',
]

export default function ChannelPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showChannelForm, setShowChannelForm] = useState(false)
  const [showVideoForm, setShowVideoForm] = useState(false)
  const [editVideoId, setEditVideoId] = useState(null)
  const [channelForm, setChannelForm] = useState({
    channelName: '',
    description: '',
  })
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: 'Web Development',
  })
  const [error, setError] = useState('')
  const [videoError, setVideoError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchChannel()
  }, [user])

  const fetchChannel = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/channels/my')
      setChannel(data)
    } catch (error) {
      setChannel(null)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateChannel = async () => {
    setError('')
    if (!channelForm.channelName.trim()) {
      return setError('Channel name is required')
    }
    try {
      await axios.post('/channels', channelForm)
      setShowChannelForm(false)
      fetchChannel()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create channel')
    }
  }

  const handleVideoSubmit = async () => {
    setVideoError('')
    if (!videoForm.title.trim()) {
      return setVideoError('Title is required')
    }
    if (!videoForm.videoUrl.trim()) {
      return setVideoError('Video URL is required')
    }
    try {
      if (editVideoId) {
        await axios.put(`/videos/${editVideoId}`, videoForm)
      } else {
        await axios.post('/videos', {
          ...videoForm,
          channelId: channel._id,
        })
      }
      setShowVideoForm(false)
      setEditVideoId(null)
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        thumbnailUrl: '',
        category: 'Web Development',
      })
      fetchChannel()
    } catch (err) {
      setVideoError(err.response?.data?.message || 'Failed to save video')
    }
  }

  const handleEditVideo = (video) => {
    setEditVideoId(video._id)
    setVideoForm({
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnailUrl: video.thumbnailUrl,
      category: video.category,
    })
    setShowVideoForm(true)
    setVideoError('')
  }

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return
    try {
      await axios.delete(`/videos/${videoId}`)
      fetchChannel()
    } catch (err) {
      console.error('Failed to delete video:', err)
    }
  }

  const handleCancelVideoForm = () => {
    setShowVideoForm(false)
    setEditVideoId(null)
    setVideoForm({
      title: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: '',
      category: 'Web Development',
    })
    setVideoError('')
  }

  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views
  }

  if (loading) {
    return (
      <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        <Header onToggleSidebar={() => {}} onSearch={() => {}} />
        <div style={styles.centered}>
          <p style={{ color: '#aaa' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Header onToggleSidebar={() => {}} onSearch={() => {}} />

      <div style={styles.container}>

        {/* No Channel Yet */}
        {!channel ? (
          <div style={styles.noChannel}>
            <div style={styles.noChannelIcon}>📺</div>
            <h2 style={styles.noChannelTitle}>You don't have a channel yet</h2>
            <p style={styles.noChannelText}>
              Create a channel to upload and manage your videos
            </p>

            {!showChannelForm ? (
              <button
                style={styles.primaryBtn}
                onClick={() => setShowChannelForm(true)}
              >
                Create Channel
              </button>
            ) : (
              <div style={styles.form}>
                <h3 style={styles.formTitle}>Create Your Channel</h3>
                {error && <p style={styles.errorText}>⚠️ {error}</p>}
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Channel Name</label>
                  <input
                    style={styles.input}
                    placeholder="Enter channel name"
                    value={channelForm.channelName}
                    onChange={(e) =>
                      setChannelForm({
                        ...channelForm,
                        channelName: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Description</label>
                  <input
                    style={styles.input}
                    placeholder="Describe your channel"
                    value={channelForm.description}
                    onChange={(e) =>
                      setChannelForm({
                        ...channelForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={styles.formBtns}>
                  <button
                    style={styles.cancelBtn}
                    onClick={() => setShowChannelForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    style={styles.primaryBtn}
                    onClick={handleCreateChannel}
                  >
                    Create Channel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Channel Header */}
            <div style={styles.channelHeader}>
              <div style={styles.channelBanner} />
              <div style={styles.channelInfo}>
                <div style={styles.channelAvatar}>
                  {channel.channelName.charAt(0).toUpperCase()}
                </div>
                <div style={styles.channelDetails}>
                  <h2 style={styles.channelName}>{channel.channelName}</h2>
                  <p style={styles.channelStats}>
                    {channel.subscribers} subscribers •{' '}
                    {channel.videos?.length || 0} videos
                  </p>
                  <p style={styles.channelDesc}>{channel.description}</p>
                </div>
              </div>
            </div>

            {/* Upload Button */}
            {!showVideoForm && (
              <button
                style={styles.primaryBtn}
                onClick={() => setShowVideoForm(true)}
              >
                + Upload Video
              </button>
            )}

            {/* Video Upload / Edit Form */}
            {showVideoForm && (
              <div style={styles.form}>
                <h3 style={styles.formTitle}>
                  {editVideoId ? 'Edit Video' : 'Upload New Video'}
                </h3>
                {videoError && (
                  <p style={styles.errorText}>⚠️ {videoError}</p>
                )}
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Title *</label>
                  <input
                    style={styles.input}
                    placeholder="Enter video title"
                    value={videoForm.title}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, title: e.target.value })
                    }
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Description</label>
                  <input
                    style={styles.input}
                    placeholder="Enter video description"
                    value={videoForm.description}
                    onChange={(e) =>
                      setVideoForm({
                        ...videoForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Video URL *</label>
                  <input
                    style={styles.input}
                    placeholder="Enter video URL"
                    value={videoForm.videoUrl}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, videoUrl: e.target.value })
                    }
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Thumbnail URL</label>
                  <input
                    style={styles.input}
                    placeholder="Enter thumbnail URL"
                    value={videoForm.thumbnailUrl}
                    onChange={(e) =>
                      setVideoForm({
                        ...videoForm,
                        thumbnailUrl: e.target.value,
                      })
                    }
                  />
                </div>
                <div style={styles.inputWrapper}>
                  <label style={styles.label}>Category</label>
                  <select
                    style={styles.input}
                    value={videoForm.category}
                    onChange={(e) =>
                      setVideoForm({ ...videoForm, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={styles.formBtns}>
                  <button
                    style={styles.cancelBtn}
                    onClick={handleCancelVideoForm}
                  >
                    Cancel
                  </button>
                  <button
                    style={styles.primaryBtn}
                    onClick={handleVideoSubmit}
                  >
                    {editVideoId ? 'Save Changes' : 'Upload Video'}
                  </button>
                </div>
              </div>
            )}

            {/* Videos List */}
            <h3 style={styles.videosHeading}>
              Your Videos ({channel.videos?.length || 0})
            </h3>

            {channel.videos?.length === 0 ? (
              <div style={styles.noVideos}>
                <p style={{ color: '#aaa' }}>
                  No videos yet. Upload your first video!
                </p>
              </div>
            ) : (
              <div style={styles.videosList}>
                {channel.videos?.map((video) => (
                  <div key={video._id} style={styles.videoItem}>
                    {/* Thumbnail */}
                    <img
                      src={
                        video.thumbnailUrl ||
                        `https://picsum.photos/seed/${video._id}/160/90`
                      }
                      alt={video.title}
                      style={styles.videoThumb}
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/seed/${video._id}/160/90`
                      }}
                    />

                    {/* Video Info */}
                    <div style={styles.videoInfo}>
                      <p style={styles.videoTitle}>{video.title}</p>
                      <p style={styles.videoMeta}>
                        {formatViews(video.views)} views • {video.category}
                      </p>
                      <p style={styles.videoDesc}>{video.description}</p>
                    </div>

                    {/* Action Buttons */}
                    <div style={styles.videoActions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => handleEditVideo(video)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteVideo(video._id)}
                      >
                        🗑️ Delete
                      </button>
                      <button
                        style={styles.watchBtn}
                        onClick={() => navigate(`/video/${video._id}`)}
                      >
                        ▶ Watch
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    background: '#0f0f0f',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '20px 16px',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
  noChannel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '16px',
    textAlign: 'center',
  },
  noChannelIcon: {
    fontSize: '64px',
  },
  noChannelTitle: {
    color: '#fff',
    fontSize: '24px',
  },
  noChannelText: {
    color: '#aaa',
    fontSize: '14px',
  },
  channelHeader: {
    marginBottom: '24px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#1a1a1a',
  },
  channelBanner: {
    width: '100%',
    height: '120px',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '16px 20px',
  },
  channelAvatar: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: '#3ea6ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    fontWeight: 'bold',
    marginTop: '-40px',
    border: '4px solid #1a1a1a',
  },
  channelDetails: {
    flex: 1,
  },
  channelName: {
    color: '#fff',
    fontSize: '22px',
    margin: '0 0 4px',
  },
  channelStats: {
    color: '#aaa',
    fontSize: '13px',
    margin: '0 0 4px',
  },
  channelDesc: {
    color: '#aaa',
    fontSize: '13px',
    margin: 0,
  },
  form: {
    background: '#1a1a1a',
    padding: '24px',
    borderRadius: '12px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    margin: '16px 0',
  },
  formTitle: {
    color: '#fff',
    fontSize: '18px',
    margin: 0,
  },
  errorText: {
    color: '#f44',
    fontSize: '13px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    color: '#aaa',
    fontSize: '13px',
  },
  input: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #444',
    background: '#272727',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  formBtns: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end',
    marginTop: '4px',
  },
  primaryBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    background: '#3ea6ff',
    color: '#000',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  cancelBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    background: '#272727',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  videosHeading: {
    color: '#fff',
    fontSize: '18px',
    margin: '24px 0 16px',
  },
  noVideos: {
    padding: '40px',
    textAlign: 'center',
    background: '#1a1a1a',
    borderRadius: '12px',
  },
  videosList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  videoItem: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    background: '#1a1a1a',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #272727',
  },
  videoThumb: {
    width: '160px',
    height: '90px',
    objectFit: 'cover',
    borderRadius: '8px',
    flexShrink: 0,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    margin: '0 0 4px',
  },
  videoMeta: {
    color: '#aaa',
    fontSize: '13px',
    margin: '0 0 4px',
  },
  videoDesc: {
    color: '#777',
    fontSize: '13px',
    margin: 0,
  },
  videoActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    background: '#272727',
    color: '#3ea6ff',
    border: '1px solid #3ea6ff',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    background: '#272727',
    color: '#f44',
    border: '1px solid #f44',
    cursor: 'pointer',
    fontSize: '13px',
  },
  watchBtn: {
    padding: '6px 14px',
    borderRadius: '6px',
    background: '#272727',
    color: '#fff',
    border: '1px solid #555',
    cursor: 'pointer',
    fontSize: '13px',
  },
}
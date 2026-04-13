import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'

export default function VideoPlayer() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [liked, setLiked] = useState(false)
  const [disliked, setDisliked] = useState(false)

  useEffect(() => {
    fetchVideo()
    fetchComments()
  }, [id])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get(`/videos/${id}`)
      setVideo(data)
      if (user) {
        setLiked(data.likes.includes(user.id))
        setDisliked(data.dislikes.includes(user.id))
      }
    } catch (error) {
      console.error('Failed to fetch video:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/comments/${id}`)
      setComments(data)
    } catch (error) {
      console.error('Failed to fetch comments:', error)
    }
  }

  const handleLike = async () => {
    if (!user) return navigate('/login')
    try {
      const { data } = await axios.put(`/videos/${id}/like`)
      setVideo((v) => ({
        ...v,
        likes: Array(data.likes).fill(null),
        dislikes: Array(data.dislikes).fill(null),
      }))
      setLiked(!liked)
      if (disliked) setDisliked(false)
    } catch (error) {
      console.error('Failed to like video:', error)
    }
  }

  const handleDislike = async () => {
    if (!user) return navigate('/login')
    try {
      const { data } = await axios.put(`/videos/${id}/dislike`)
      setVideo((v) => ({
        ...v,
        likes: Array(data.likes).fill(null),
        dislikes: Array(data.dislikes).fill(null),
      }))
      setDisliked(!disliked)
      if (liked) setLiked(false)
    } catch (error) {
      console.error('Failed to dislike video:', error)
    }
  }

  const handleAddComment = async () => {
    if (!user) return navigate('/login')
    if (!newComment.trim()) return
    try {
      setCommentLoading(true)
      await axios.post(`/comments/${id}`, { text: newComment })
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return
    try {
      await axios.put(`/comments/comment/${commentId}`, { text: editText })
      setEditId(null)
      setEditText('')
      fetchComments()
    } catch (error) {
      console.error('Failed to edit comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await axios.delete(`/comments/comment/${commentId}`)
      fetchComments()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
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
          <p style={{ color: '#aaa' }}>Loading video...</p>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div style={{ background: '#0f0f0f', minHeight: '100vh' }}>
        <Header onToggleSidebar={() => {}} onSearch={() => {}} />
        <div style={styles.centered}>
          <p style={{ color: '#aaa' }}>Video not found</p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <Header onToggleSidebar={() => {}} onSearch={(q) => navigate(`/?search=${q}`)} />

      <div style={styles.container}>

        {/* Video Player */}
        <video
          src={video.videoUrl}
          controls
          style={styles.player}
        />

        {/* Video Title */}
        <h1 style={styles.title}>{video.title}</h1>

        {/* Channel + Actions Row */}
        <div style={styles.metaRow}>
          <div style={styles.channelInfo}>
            <div style={styles.channelAvatar}>
              {video.channelId?.channelName
                ? video.channelId.channelName.charAt(0).toUpperCase()
                : 'C'}
            </div>
            <div>
              <p style={styles.channelName}>
                {video.channelId?.channelName || 'Unknown Channel'}
              </p>
              <p style={styles.viewCount}>
                {formatViews(video.views)} views
              </p>
            </div>
          </div>

          {/* Like Dislike Buttons */}
          <div style={styles.actions}>
            <button
              style={{
                ...styles.actionBtn,
                background: liked ? '#fff' : '#272727',
                color: liked ? '#000' : '#fff',
              }}
              onClick={handleLike}
            >
              👍 {video.likes?.length || 0}
            </button>
            <button
              style={{
                ...styles.actionBtn,
                background: disliked ? '#fff' : '#272727',
                color: disliked ? '#000' : '#fff',
              }}
              onClick={handleDislike}
            >
              👎 {video.dislikes?.length || 0}
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={styles.descriptionBox}>
          <p style={styles.description}>{video.description}</p>
        </div>

        {/* Comments Section */}
        <div style={styles.commentsSection}>
          <h3 style={styles.commentsHeading}>
            {comments.length} Comments
          </h3>

          {/* Add Comment */}
          {user ? (
            <div style={styles.addComment}>
              <div style={styles.commentAvatar}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={styles.commentInputWrapper}>
                <input
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <div style={styles.commentBtns}>
                  <button
                    style={styles.cancelCommentBtn}
                    onClick={() => setNewComment('')}
                  >
                    Cancel
                  </button>
                  <button
                    style={{
                      ...styles.postCommentBtn,
                      opacity: commentLoading ? 0.7 : 1,
                    }}
                    onClick={handleAddComment}
                    disabled={commentLoading}
                  >
                    {commentLoading ? 'Posting...' : 'Comment'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.signInToComment}>
              <p style={{ color: '#aaa', fontSize: '14px' }}>
                <span
                  style={{ color: '#3ea6ff', cursor: 'pointer' }}
                  onClick={() => navigate('/login')}
                >
                  Sign in
                </span>{' '}
                to add a comment
              </p>
            </div>
          )}

          {/* Comments List */}
          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment._id} style={styles.comment}>
                <div style={styles.commentAvatar}>
                  {comment.userId?.username
                    ? comment.userId.username.charAt(0).toUpperCase()
                    : 'U'}
                </div>
                <div style={styles.commentContent}>
                  <div style={styles.commentHeader}>
                    <span style={styles.commentUsername}>
                      @{comment.userId?.username}
                    </span>
                    <span style={styles.commentDate}>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Edit Mode */}
                  {editId === comment._id ? (
                    <div style={styles.editWrapper}>
                      <input
                        style={styles.commentInput}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <div style={styles.commentBtns}>
                        <button
                          style={styles.cancelCommentBtn}
                          onClick={() => setEditId(null)}
                        >
                          Cancel
                        </button>
                        <button
                          style={styles.postCommentBtn}
                          onClick={() => handleEditComment(comment._id)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p style={styles.commentText}>{comment.text}</p>
                  )}

                  {/* Edit/Delete buttons - only for comment owner */}
                  {user && user.id === comment.userId?._id && (
                    <div style={styles.commentActions}>
                      <button
                        style={styles.editBtn}
                        onClick={() => {
                          setEditId(comment._id)
                          setEditText(comment.text)
                        }}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
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
  player: {
    width: '100%',
    borderRadius: '10px',
    background: '#000',
    maxHeight: '500px',
  },
  title: {
    color: '#fff',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '16px 0 12px',
    lineHeight: 1.4,
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '12px',
  },
  channelInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  channelAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#3ea6ff',
    color: '#000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  channelName: {
    color: '#fff',
    fontSize: '15px',
    fontWeight: 'bold',
    margin: 0,
  },
  viewCount: {
    color: '#aaa',
    fontSize: '13px',
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    padding: '8px 18px',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  descriptionBox: {
    background: '#1a1a1a',
    borderRadius: '10px',
    padding: '14px 16px',
    marginBottom: '24px',
  },
  description: {
    color: '#ccc',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  commentsSection: {
    marginTop: '8px',
  },
  commentsHeading: {
    color: '#fff',
    fontSize: '16px',
    marginBottom: '20px',
  },
  addComment: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  commentAvatar: {
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
  commentInputWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  commentInput: {
    width: '100%',
    padding: '8px 0',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid #555',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  commentBtns: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
  },
  cancelCommentBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    background: 'transparent',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
  },
  postCommentBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    background: '#3ea6ff',
    color: '#000',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  signInToComment: {
    marginBottom: '24px',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  comment: {
    display: 'flex',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid #1a1a1a',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    marginBottom: '4px',
  },
  commentUsername: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  commentDate: {
    color: '#666',
    fontSize: '12px',
  },
  commentText: {
    color: '#ccc',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  editWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  commentActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
}
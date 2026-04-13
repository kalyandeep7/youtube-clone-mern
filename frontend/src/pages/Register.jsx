import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from '../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (!form.username || !form.email || !form.password) {
      return 'All fields are required'
    }
    if (form.username.length < 3) {
      return 'Username must be at least 3 characters'
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return 'Invalid email format'
    }
    if (form.password.length < 6) {
      return 'Password must be at least 6 characters'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) return setError(validationError)

    try {
      setLoading(true)
      await axios.post('/auth/register', form)
      // After successful registration redirect to login
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.box}>

        {/* Logo */}
        <div style={styles.logoWrapper}>
          <span style={styles.logoIcon}>▶</span>
          <span style={styles.logoText}>
            <span style={{ color: '#ff0000' }}>You</span>Tube
          </span>
        </div>

        <h2 style={styles.heading}>Create Account</h2>
        <p style={styles.subheading}>to continue to YouTube</p>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Form */}
        <div style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Username</label>
            <input
              style={styles.input}
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            style={{
              ...styles.btn,
              opacity: loading ? 0.7 : 1,
            }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        {/* Login Link */}
        <p style={styles.loginText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.loginLink}>
            Sign In
          </Link>
        </p>

      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#0f0f0f',
  },
  box: {
    background: '#1a1a1a',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '380px',
    border: '1px solid #333',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  logoIcon: {
    background: '#ff0000',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '16px',
  },
  logoText: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: 'bold',
  },
  heading: {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0',
  },
  subheading: {
    color: '#aaa',
    fontSize: '14px',
    marginBottom: '8px',
  },
  errorBox: {
    background: '#2a1a1a',
    border: '1px solid #f44',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#f44',
    fontSize: '13px',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    width: '100%',
    marginTop: '8px',
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
  btn: {
    padding: '12px',
    borderRadius: '8px',
    background: '#3ea6ff',
    color: '#000',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
    marginTop: '4px',
    transition: 'opacity 0.2s',
  },
  loginText: {
    color: '#aaa',
    fontSize: '14px',
    marginTop: '8px',
  },
  loginLink: {
    color: '#3ea6ff',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
}
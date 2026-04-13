const CATEGORIES = [
  'All',
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

export default function FilterBar({ selected, onSelect }) {
  return (
    <div style={styles.bar}>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          style={{
            ...styles.btn,
            ...(selected === cat ? styles.active : {}),
          }}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

const styles = {
  bar: {
    display: 'flex',
    gap: '8px',
    padding: '12px 16px',
    overflowX: 'auto',
    background: '#0f0f0f',
    position: 'sticky',
    top: '56px',
    zIndex: 90,
    scrollbarWidth: 'none',
  },
  btn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: 'none',
    background: '#272727',
    color: '#fff',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
  active: {
    background: '#fff',
    color: '#000',
    fontWeight: 'bold',
  },
}
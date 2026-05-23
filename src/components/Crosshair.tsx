export default function Crosshair() {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="3" fill="none" stroke="#000" strokeWidth="1" />
        <line x1="10" y1="1" x2="10" y2="5" stroke="#000" strokeWidth="1" />
        <line x1="10" y1="15" x2="10" y2="19" stroke="#000" strokeWidth="1" />
        <line x1="1" y1="10" x2="5" y2="10" stroke="#000" strokeWidth="1" />
        <line x1="15" y1="10" x2="19" y2="10" stroke="#000" strokeWidth="1" />
      </svg>
    </div>
  );
}

export default function PaperOverlay() {
  return (
    <div
      className="paper-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  )
}

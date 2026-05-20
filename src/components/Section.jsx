import { useState } from 'react';

export default function Section({ icon, title, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="action-block">
      <div className="collapsible-header" onClick={() => setOpen(!open)}>
        <div className="section-label" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          <span className="section-icon">{icon}</span>
          <span className="section-title">{title}</span>
          {badge && (
            <span style={{
              fontSize: '0.65rem',
              padding: '2px 8px',
              background: 'rgba(201,168,76,0.12)',
              border: '1px solid rgba(201,168,76,0.2)',
              borderRadius: '10px',
              color: '#c9a84c',
              letterSpacing: '0.06em',
              fontFamily: 'Outfit, sans-serif',
              fontWeight: 600,
            }}>{badge}</span>
          )}
        </div>
        <span className={`collapsible-arrow ${open ? 'open' : ''}`}>▼</span>
      </div>
      <div className={`collapsible-body ${open ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
}

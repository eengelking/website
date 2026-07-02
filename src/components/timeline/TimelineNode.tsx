import { useState } from 'react';
import { motion } from 'framer-motion';
import type { TimelineRole } from '../../types/content';

export function TimelineNode({ role, isActive }: { role: TimelineRole; isActive: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      className="timeline-node"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="node-marker" aria-hidden="true">
        <span className="dot" />
      </div>
      <div className="node-body">
        <button
          type="button"
          className="node-header"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <div className="node-heading">
            <span className="node-date mono">{role.dateRange}</span>
            <h3>
              {role.company}
              {role.returnEngagement && <span className="return-badge mono"> · return engagement</span>}
            </h3>
            <p className="node-title">{role.title}</p>
          </div>
          <span className={`node-expand${isActive ? ' active' : ''}${open ? ' open' : ''}`} aria-hidden="true">
            {open ? '−' : '+'}
          </span>
        </button>

        <p className="node-scope">{role.scope}</p>
        {role.summary && <p className="node-summary">{role.summary}</p>}

        <div className="node-tags">
          {role.tags.map((tag) => (
            <span key={tag} className="tag mono">{tag}</span>
          ))}
        </div>

        {open && (
          <motion.ul
            className="node-bullets"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </motion.ul>
        )}
      </div>
    </motion.article>
  );
}

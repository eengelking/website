import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { timeline } from '../../data/timeline';
import { TimelineNode } from './TimelineNode';
import './timeline.css';

export function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });
  const [activeIndex, setActiveIndex] = useState(-1);

  // Derive the active role from the exact same fill value driving the line,
  // so the two can never drift apart. A role is active for the whole span
  // between its dot and the next one, not just a brief center-crossing instant.
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const container = containerRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const fillPx = latest * containerRect.height;
    const dots = container.querySelectorAll<HTMLElement>('.dot');
    let idx = -1;
    dots.forEach((dot, i) => {
      const dotOffset = dot.getBoundingClientRect().top - containerRect.top;
      if (fillPx >= dotOffset) idx = i;
    });
    setActiveIndex(idx);
  });

  return (
    <div className="timeline-wrap" ref={containerRef}>
      <div className="timeline-track" aria-hidden="true">
        <motion.div className="timeline-fill" style={{ scaleY: scrollYProgress, height: '100%' }} />
      </div>
      <div className="timeline-list">
        {timeline.map((role, i) => (
          <TimelineNode key={role.id} role={role} isActive={i === activeIndex} />
        ))}
      </div>
    </div>
  );
}

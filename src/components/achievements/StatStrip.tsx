import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { achievements } from '../../data/achievements';

function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const numericMatch = value.match(/^(\$?)([\d.]+)(.*)$/);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || !numericMatch) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const [, prefix, numStr, suffix] = numericMatch;
    const target = parseFloat(numStr);
    const isDecimal = numStr.includes('.');
    const duration = 2200;
    const delay = 300;
    const start = performance.now() + delay;

    setDisplay(`${prefix}0${suffix}`);

    function tick(now: number) {
      const progress = Math.min(Math.max((now - start) / duration, 0), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      const formatted = isDecimal ? current.toFixed(2) : Math.round(current).toString();
      setDisplay(`${prefix}${formatted}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView]);

  return <span ref={ref}>{display}</span>;
}

export function StatStrip() {
  return (
    <div className="stat-strip">
      {achievements.map((item, i) => (
        <motion.div
          key={item.label}
          className="stat"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: i * 0.12 }}
        >
          <div className="stat-value mono">
            <StatValue value={item.value} />
          </div>
          <div className="stat-label">{item.label}</div>
        </motion.div>
      ))}
      <style>{`
        .stat-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: var(--space-4);
        }
        .stat-value {
          font-size: var(--text-2xl);
          color: var(--color-accent);
          font-weight: 600;
        }
        .stat-label {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
          margin-top: var(--space-1);
        }
      `}</style>
    </div>
  );
}

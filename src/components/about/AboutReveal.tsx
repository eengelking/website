import { useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';

export function AboutReveal({
  hook,
  paragraphs,
  highlights,
}: {
  hook: string;
  paragraphs: string[];
  highlights: string[];
}) {
  const teaserRef = useRef<HTMLParagraphElement>(null);
  const revealed = useInView(teaserRef, { once: true, margin: '-45% 0px -45% 0px' });

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className={`about-wrap${revealed ? ' is-revealed' : ''}`}>
      <div className="about-grid">
        <AnimatePresence mode="popLayout" initial={false}>
          {!revealed && (
            <motion.div
              key="teaser"
              className="teaser-group"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.p ref={teaserRef} layoutId="hook" transition={{ duration: 0.6, ease }} className="hook hook-teaser">
                &ldquo;{hook}&rdquo;
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {revealed && (
          <div className="about-hook-col">
            <p className="eyebrow">about</p>
            <motion.p layoutId="hook" transition={{ duration: 0.6, ease }} className="hook">
              &ldquo;{hook}&rdquo;
            </motion.p>
          </div>
        )}

        {revealed && (
          <motion.div
            className="about-body-col"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease }}
          >
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ul className="highlights">
              {highlights.map((h) => (
                <li key={h}>
                  <span className="marker mono" aria-hidden="true">
                    ›
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <motion.p
              className="next-cue mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              aria-hidden="true"
            >
              career timeline ↓
            </motion.p>
          </motion.div>
        )}
      </div>

      <style>{`
        .about-wrap {
          position: relative;
          min-height: 90vh;
          padding-top: var(--space-7);
        }
        .about-wrap.is-revealed {
          min-height: 0;
          padding-bottom: var(--space-6);
        }
        .about-grid {
          position: relative;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: var(--space-6);
          align-items: start;
          max-width: var(--max-width);
          margin: 0 auto;
          padding: 0 var(--space-4);
        }
        .teaser-group {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
          text-align: center;
          padding: var(--space-6) var(--space-4);
        }
        .about-hook-col {
          display: flex;
          flex-direction: column;
        }
        .about-hook-col p {
          margin: 0;
        }
        .hook {
          font-family: var(--font-display);
          font-style: italic;
          font-size: var(--text-xl);
          color: var(--color-text);
          line-height: 1.3;
          text-align: left;
        }
        .about-hook-col p + p {
          margin-top: var(--space-2);
        }
        .hook-teaser {
          font-size: clamp(1.5rem, 4vw, 2.75rem);
          text-align: center;
          white-space: nowrap;
        }
        .about-body-col p {
          margin: 0 0 var(--space-3);
        }
        .highlights {
          list-style: none;
          margin: var(--space-3) 0 0;
          padding: 0;
        }
        .highlights li {
          display: flex;
          gap: var(--space-2);
          padding: var(--space-1) 0;
          color: var(--color-text-muted);
          font-size: var(--text-sm);
        }
        .marker {
          color: var(--color-accent);
        }
        .about-body-col .next-cue {
          margin-top: var(--space-5);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }
        @media (max-width: 800px) {
          .about-grid {
            grid-template-columns: 1fr;
          }
          .hook-teaser {
            white-space: normal;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .about-wrap {
            min-height: 0;
          }
          .teaser-group {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

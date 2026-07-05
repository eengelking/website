import { useEffect, useMemo, useState } from 'react';
import { matchesAllTerms, parseSearchTerms } from '../../utils/searchQuery';

export interface PostListItem {
  slug: string;
  title: string;
  description: string;
  dateLabel: string;
  tags: string[];
  href?: string;
}

interface PostListProps {
  items: PostListItem[];
  emptyLabel: string;
  searchPlaceholder: string;
}

export function PostList({ items, emptyLabel, searchPlaceholder }: PostListProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('q');
    if (fromUrl) setQuery(fromUrl);
  }, []);

  const filtered = useMemo(() => {
    const terms = parseSearchTerms(query);
    if (terms.length === 0) return items;
    return items.filter((item) => matchesAllTerms(`${item.title} ${item.description} ${item.tags.join(' ')}`, terms));
  }, [items, query]);

  function handleEntryClick(e: React.MouseEvent<HTMLElement>, href?: string) {
    if (!href) return;
    // Let the title link and tag buttons handle their own clicks.
    if ((e.target as HTMLElement).closest('a, button')) return;
    // Don't hijack a click that's really the end of a text selection/copy drag.
    if ((window.getSelection()?.toString().length ?? 0) > 0) return;
    window.location.href = href;
  }

  return (
    <div className="post-list">
      <div className="search-input-wrap">
        <svg className="search-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11" y1="11" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search posts"
        />
      </div>

      {query.trim() && (
        <p className="result-count mono" role="status">
          {filtered.length} match{filtered.length === 1 ? '' : 'es'}
        </p>
      )}

      <div className="entries">
        {filtered.map((item) => (
          <article
            key={item.slug}
            className={`entry${item.href ? ' entry-clickable' : ''}`}
            onClick={(e) => handleEntryClick(e, item.href)}
          >
            <span className="entry-date mono">{item.dateLabel}</span>
            {item.href ? (
              <a className="entry-title" href={item.href}>
                {item.title}
              </a>
            ) : (
              <span className="entry-title">{item.title}</span>
            )}
            <span className="entry-desc">{item.description}</span>
            {item.tags.length > 0 && (
              <span className="entry-tags">
                {item.tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="mono entry-tag"
                    onClick={() => setQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </span>
            )}
          </article>
        ))}
        {filtered.length === 0 && <p className="empty">{query.trim() ? `No posts match "${query}".` : emptyLabel}</p>}
      </div>

      <style>{`
        .search-input-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          padding: var(--space-2) var(--space-3);
          margin-bottom: var(--space-2);
        }
        .search-icon {
          color: var(--color-text-muted);
          flex-shrink: 0;
        }
        .search-input-wrap:focus-within .search-icon {
          color: var(--color-accent);
        }
        .search-input-wrap input {
          flex: 1;
          background: none;
          border: none;
          color: var(--color-text);
          font-family: var(--font-body);
          font-size: var(--text-base);
          outline: none;
        }
        .search-input-wrap input::placeholder {
          color: var(--color-text-muted);
        }
        .result-count {
          color: var(--color-text-muted);
          font-size: var(--text-xs);
          margin-bottom: var(--space-2);
        }
        .entries {
          display: flex;
          flex-direction: column;
        }
        .entry {
          display: grid;
          grid-template-columns: 10rem 1fr;
          gap: var(--space-3);
          padding: var(--space-3) 0;
          border-top: 1px solid var(--color-border);
          color: var(--color-text);
        }
        .entry-clickable {
          cursor: pointer;
        }
        .entry-clickable:hover .entry-title {
          color: var(--color-accent);
        }
        .entry-date {
          color: var(--color-text-muted);
          font-size: var(--text-sm);
        }
        .entry-title {
          display: block;
          font-family: var(--font-display);
          font-size: var(--text-lg);
          color: var(--color-text);
        }
        .entry-desc {
          display: block;
          color: var(--color-text-muted);
          font-size: var(--text-sm);
          grid-column: 2;
        }
        .entry-tags {
          grid-column: 2;
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
          margin-top: var(--space-1);
        }
        .entry-tag {
          font-size: var(--text-xs);
          color: var(--color-signal);
          background: none;
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          padding: 2px 8px;
          cursor: pointer;
        }
        .entry-tag:hover {
          border-color: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .empty {
          color: var(--color-text-muted);
          padding: var(--space-4) 0;
        }
        @media (max-width: 640px) {
          .entry {
            grid-template-columns: 1fr;
          }
          .entry-desc,
          .entry-tags {
            grid-column: 1;
          }
        }
      `}</style>
    </div>
  );
}

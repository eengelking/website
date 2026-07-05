import { useMemo, useState } from 'react';
import { skills } from '../../data/skills';
import { matchesAllTerms, parseSearchTerms } from '../../utils/searchQuery';

const categoryCounts = (() => {
  const map = new Map<string, number>();
  for (const item of skills) {
    map.set(item.category, (map.get(item.category) ?? 0) + 1);
  }
  return [...map.entries()];
})();

export function SkillSearch() {
  const [query, setQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<Set<string>>(() => new Set());

  const filtered = useMemo(() => {
    const terms = parseSearchTerms(query);
    return skills.filter((s) => {
      if (activeCategories.size > 0 && !activeCategories.has(s.category)) return false;
      return matchesAllTerms(`${s.name} ${s.category} ${s.tags.join(' ')}`, terms);
    });
  }, [query, activeCategories]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const item of filtered) {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category)!.push(item);
    }
    return map;
  }, [filtered]);

  function toggleCategory(category: string) {
    setActiveCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  return (
    <div className="skill-search">
      <div className="category-chips" role="group" aria-label="Filter by category">
        {categoryCounts.map(([category, count]) => (
          <button
            key={category}
            type="button"
            className={`chip mono${activeCategories.has(category) ? ' active' : ''}`}
            onClick={() => toggleCategory(category)}
            aria-pressed={activeCategories.has(category)}
          >
            {category} <span className="chip-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="search-input-wrap">
        <svg className="search-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11" y1="11" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Type to search skills — try &quot;kubernetes&quot;, &quot;SQL&quot;, or &quot;hardening&quot;"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search skills"
        />
      </div>

      <p className="result-count mono" role="status">
        {filtered.length} match{filtered.length === 1 ? '' : 'es'}
      </p>

      <div className="results">
        {[...grouped.entries()].map(([category, items]) => (
          <div key={category} className="result-group">
            <h3>{category}</h3>
            <ul>
              {items.map((item) => (
                <li key={item.name}>{item.name}</li>
              ))}
            </ul>
          </div>
        ))}
        {filtered.length === 0 && <p className="no-results">No skills match "{query}".</p>}
      </div>

      <style>{`
        .category-chips {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
          margin-bottom: var(--space-3);
        }
        .chip {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius);
          color: var(--color-text-muted);
          font-size: var(--text-xs);
          padding: var(--space-1) var(--space-2);
          cursor: pointer;
        }
        .chip:hover {
          border-color: var(--color-accent-dim);
          color: var(--color-text);
        }
        .chip.active {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .chip-count {
          color: var(--color-text-muted);
        }
        .chip.active .chip-count {
          color: var(--color-accent);
        }
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
          margin-bottom: var(--space-4);
        }
        .results {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--space-4);
        }
        .result-group h3 {
          font-size: var(--text-sm);
          color: var(--color-signal);
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--space-1);
          margin-bottom: var(--space-2);
        }
        .result-group ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .result-group li {
          font-size: var(--text-sm);
          padding: var(--space-1) 0;
          color: var(--color-text);
        }
        .no-results {
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}

import { useMemo, useState } from 'react';
import { projects } from '../../data/projects';
import { matchesAllTerms, parseSearchTerms } from '../../utils/searchQuery';

const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));

export function ProjectSearch() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const terms = parseSearchTerms(query);
    if (terms.length === 0) return sortedProjects;
    return sortedProjects.filter((project) =>
      matchesAllTerms(`${project.name} ${project.description} ${project.technologies.join(' ')}`, terms)
    );
  }, [query]);

  return (
    <div className="project-search">
      <div className="search-input-wrap">
        <svg className="search-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <line x1="11" y1="11" x2="15" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder={'Type to search projects — try "kubernetes" or "swift"'}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search projects"
        />
      </div>

      {query.trim() && (
        <p className="result-count mono" role="status">
          {filtered.length} match{filtered.length === 1 ? '' : 'es'}
        </p>
      )}

      <div className="project-grid">
        {filtered.map((project) => (
          <article key={project.name} className="project-card">
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <div className="tech-tags">
              {project.technologies.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  className="mono"
                  onClick={() => setQuery(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" className="mono project-link">
                View on GitHub →
              </a>
            )}
          </article>
        ))}
        {filtered.length === 0 && <p className="empty">No projects match "{query}".</p>}
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
          margin-bottom: var(--space-4);
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
          margin-bottom: var(--space-3);
        }
        .project-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-3);
        }
        .project-card {
          background: var(--color-surface);
          border: 1px solid var(--color-hero-border);
          border-radius: var(--radius);
          padding: var(--space-3);
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .project-card:hover {
          border-color: var(--color-accent-dim);
          transform: translateY(-2px);
        }
        .project-card h3 {
          font-size: var(--text-base);
          margin-bottom: var(--space-1);
        }
        .project-card p {
          font-size: var(--text-sm);
          color: var(--color-text-muted);
        }
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-1);
          margin-top: var(--space-2);
        }
        .tech-tags button {
          font-size: var(--text-xs);
          padding: 2px 8px;
          border: 1px solid var(--color-tag-border);
          border-radius: var(--radius);
          color: var(--color-tag);
          background: none;
          cursor: pointer;
        }
        .tech-tags button:hover {
          border-color: var(--color-accent-dim);
          color: var(--color-accent);
        }
        .project-link {
          display: inline-block;
          margin-top: var(--space-2);
          font-size: var(--text-sm);
          color: var(--color-accent);
        }
        .empty {
          color: var(--color-text-muted);
          padding: var(--space-4) 0;
          grid-column: 1 / -1;
        }
      `}</style>
    </div>
  );
}

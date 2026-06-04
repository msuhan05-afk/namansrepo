import { Icon } from '@/components/common/Icon';
import { SERVICES } from '@/data/services';
import type { WebService } from '@/types';
import './Sidebar.css';

interface SidebarProps {
  activeServiceId: string | null;
  onSelect: (service: WebService) => void;
  /** Toggles the AI assistant panel. */
  onToggleAssistant: () => void;
  assistantOpen: boolean;
}

/**
 * Vertical icon rail (Arc-style). The active item gets an animated accent pill
 * and a brand-tinted glow. Hover reveals the service name as a floating label.
 */
export function Sidebar({ activeServiceId, onSelect, onToggleAssistant, assistantOpen }: SidebarProps) {
  return (
    <nav className="wd-sidebar wd-glass" aria-label="Services">
      <div className="wd-sidebar__brand" title="WebDock">
        <span className="wd-sidebar__brand-dot" />
      </div>

      <ul className="wd-sidebar__list">
        {SERVICES.map((service) => {
          const active = service.id === activeServiceId;
          return (
            <li key={service.id}>
              <button
                type="button"
                className={`wd-sidebar__item ${active ? 'is-active' : ''}`}
                style={{ ['--item-accent' as string]: service.accent }}
                onClick={() => onSelect(service)}
                aria-current={active ? 'page' : undefined}
                aria-label={service.name}
              >
                <span className="wd-sidebar__pill" aria-hidden="true" />
                <span className="wd-sidebar__icon">
                  <Icon name={service.icon} size={20} />
                </span>
                <span className="wd-sidebar__label">{service.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="wd-sidebar__footer">
        <button
          type="button"
          className={`wd-sidebar__item wd-sidebar__assistant ${assistantOpen ? 'is-active' : ''}`}
          style={{ ['--item-accent' as string]: 'var(--wd-accent)' }}
          onClick={onToggleAssistant}
          aria-pressed={assistantOpen}
          aria-label="WebDock AI assistant"
        >
          <span className="wd-sidebar__pill" aria-hidden="true" />
          <span className="wd-sidebar__icon">
            <Icon name="sparkles" size={20} />
          </span>
          <span className="wd-sidebar__label">Assistant</span>
        </button>
      </div>
    </nav>
  );
}

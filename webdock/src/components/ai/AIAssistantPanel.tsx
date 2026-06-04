import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { IconButton } from '@/components/common/IconButton';
import { routeIntent, type AIIntent } from '@/features/ai/aiService';
import { buildSearchUrl } from '@/features/search/searchEngine';
import './assistant.css';

interface AIAssistantPanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (url: string, serviceId: string | null) => void;
}

const EXAMPLES = [
  'Find B-roll of London',
  'Generate podcast hooks',
  'Summarize client brief',
  'Find copyright free music',
];

/**
 * Slide-in AI assistant.
 *
 * Today it uses the deterministic, offline `routeIntent` planner — it maps a
 * request to the right service and explains what it will do, then navigates.
 * It does NOT fabricate AI-generated content; the model-backed planner is a
 * clearly-marked future hook (see features/ai/aiService.ts).
 */
export function AIAssistantPanel({ open, onClose, onNavigate }: AIAssistantPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [intent, setIntent] = useState<AIIntent | null>(null);

  const run = (text: string) => {
    const value = text.trim();
    if (!value) return;
    setIntent(routeIntent(value));
  };

  const execute = (resolved: AIIntent) => {
    if (!resolved.service) return;
    const url =
      resolved.kind === 'search' && resolved.query
        ? buildSearchUrl(resolved.service, resolved.query)
        : resolved.service.url;
    onNavigate(url, resolved.service.id);
    onClose();
  };

  return (
    <aside className={`wd-assistant ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <header className="wd-assistant__header">
        <div className="wd-assistant__title">
          <Icon name="sparkles" size={16} />
          <span>WebDock Assistant</span>
        </div>
        <IconButton icon="close" label="Close assistant" onClick={onClose} size={16} />
      </header>

      <div className="wd-assistant__body">
        <span className="wd-assistant__beta">Preview · offline routing</span>
        <p className="wd-assistant__hint">
          Describe what you need. WebDock routes it to the right service. AI
          generation is coming soon.
        </p>

        <div className="wd-assistant__examples">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              className="wd-assistant__chip"
              onClick={() => {
                setPrompt(ex);
                run(ex);
              }}
            >
              {ex}
            </button>
          ))}
        </div>

        {intent?.service && (
          <div className="wd-assistant__result">
            <div className="wd-assistant__result-icon">
              <Icon name={intent.service.icon} size={18} />
            </div>
            <div className="wd-assistant__result-text">{intent.explanation}</div>
            <button
              type="button"
              className="wd-btn wd-btn--primary wd-assistant__go"
              onClick={() => execute(intent)}
            >
              Go
            </button>
          </div>
        )}
      </div>

      <form
        className="wd-assistant__composer"
        onSubmit={(e) => {
          e.preventDefault();
          run(prompt);
        }}
      >
        <input
          className="wd-assistant__input"
          placeholder="Ask WebDock…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          spellCheck={false}
          aria-label="Ask WebDock"
        />
        <IconButton icon="forward" label="Run" variant="solid" size={16} type="submit" />
      </form>
    </aside>
  );
}

import { Users } from 'lucide-react';
import { useContext } from 'react';

import { AUDIENCES, AudienceContext } from '@/contexts/audienceContext.js';
import PropTypes from 'prop-types';

const AudienceSwitcher = ({ compact = false }) => {
  const { audience, setAudience } = useContext(AudienceContext);

  if (compact) {
    return (
      <div className="flex items-center">
        <Users className="w-4 h-4 text-peoplecert-muted" />
        <select
          className="select cursor-pointer"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          aria-label="Audience"
        >
          {AUDIENCES.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center p-1 bg-white/80 dark:bg-peoplecert-navy-400 rounded-full border border-peoplecert-border dark:border-peoplecert-navy-300 shadow-sm">
      {AUDIENCES.map((a) => {
        const isActive = a.value === audience;
        return (
          <button
            key={a.value}
            type="button"
            onClick={() => setAudience(a.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              isActive
                ? 'bg-peoplecert-orange text-white shadow'
                : 'text-peoplecert-navy dark:text-gray-200 hover:bg-peoplecert-surface dark:hover:bg-peoplecert-navy-300'
            }`}
            aria-pressed={isActive}
          >
            {a.label}
          </button>
        );
      })}
    </div>
  );
};

AudienceSwitcher.propTypes = {
  compact: PropTypes.bool,
};

export default AudienceSwitcher;

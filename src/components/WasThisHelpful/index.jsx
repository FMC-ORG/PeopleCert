import { Check, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

import { PageController } from '@/sdk.js';
import PropTypes from 'prop-types';

const dispatchFeedback = (articleId, helpful) => {
  try {
    const dispatcher =
      typeof PageController.getDispatcher === 'function' ? PageController.getDispatcher() : null;
    const payload = {
      type: 'cta_clicked',
      name: 'article_feedback',
      value: helpful ? 'helpful' : 'not_helpful',
      entity: 'content',
      entityId: articleId,
    };
    if (dispatcher && typeof dispatcher.dispatch === 'function') {
      dispatcher.dispatch(payload);
    } else if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pc:feedback', { detail: payload }));
    }
  } catch (err) {
    console.warn('[WasThisHelpful] could not dispatch feedback event', err);
  }
};

const WasThisHelpful = ({ articleId }) => {
  const [choice, setChoice] = useState(null);

  const onChoose = (helpful) => {
    if (choice !== null) return;
    setChoice(helpful);
    dispatchFeedback(articleId, helpful);
  };

  return (
    <div className="pc-card p-5 md:p-6 mt-10 bg-peoplecert-surface dark:bg-peoplecert-navy-500">
      {choice === null ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-peoplecert-navy dark:text-white">Was this article helpful?</h4>
            <p className="text-sm text-peoplecert-muted dark:text-gray-300 mt-0.5">
              Your feedback improves search relevance for everyone.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onChoose(true)} className="pc-btn-secondary" aria-label="Yes, this was helpful">
              <ThumbsUp className="w-4 h-4" /> Yes
            </button>
            <button onClick={() => onChoose(false)} className="pc-btn-secondary" aria-label="No, this was not helpful">
              <ThumbsDown className="w-4 h-4" /> No
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-sm text-peoplecert-navy dark:text-gray-100">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-peoplecert-orange text-white">
            <Check className="w-4 h-4" />
          </span>
          <span className="font-medium">
            Thanks for the feedback! {choice ? 'Glad this helped.' : 'We will review and improve this article.'}
          </span>
        </div>
      )}
    </div>
  );
};

WasThisHelpful.propTypes = {
  articleId: PropTypes.string,
};

export default WasThisHelpful;

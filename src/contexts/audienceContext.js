import { createContext } from 'react';

export const AUDIENCES = [
  { value: 'professional', label: 'Professional' },
  { value: 'organization', label: 'Organization' },
  { value: 'partner', label: 'Partner' },
];

export const AudienceContext = createContext({
  audience: 'professional',
  // eslint-disable-next-line no-unused-vars
  setAudience: (a) => {},
});

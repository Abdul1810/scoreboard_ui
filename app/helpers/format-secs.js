import Ember from 'ember';

export function formatSecs(params) {
  const minutes = Math.floor(params[0] / 60);
  const seconds = String(params[0] % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export default Ember.Helper.helper(formatSecs);

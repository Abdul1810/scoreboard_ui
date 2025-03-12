import Ember from 'ember';

export function formatSecs(params) {
  const minutes = Math.floor(params[0] / 60);
  const seconds = Math.floor(params[0] % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default Ember.Helper.helper(formatSecs);
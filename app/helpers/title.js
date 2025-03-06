import Ember from 'ember';

export function setTitle(title) {
  document.title = title;
  return '';
}

export default Ember.Helper.helper(setTitle);

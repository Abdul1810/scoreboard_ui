import Ember from 'ember';

export function get([object, key]) {
  return object && object[key];
}

export default Ember.Helper.helper(get);

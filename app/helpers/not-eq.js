import Ember from 'ember';

export function notEq(params) {
  return params[0] !== params[1];
}

export default Ember.Helper.helper(notEq);
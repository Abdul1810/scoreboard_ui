import Ember from 'ember';

export function eqTwo(params) {
  return params[0] === params[1] || params[0] === params[2];
}

export default Ember.Helper.helper(eqTwo);
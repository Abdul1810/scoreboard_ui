import Ember from 'ember';

export function calculateLeft([index]) {
  let round = Math.floor(Math.log2(index + 1));
  return `${round * 200 + 10}px`;
}

export default Ember.Helper.helper(calculateLeft);
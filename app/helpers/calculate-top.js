import Ember from 'ember';

export function calculateTop([index]) {
    return `${index * 100 + 30}px`;
}

export default Ember.Helper.helper(calculateTop);
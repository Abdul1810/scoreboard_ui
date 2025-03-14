import Ember from 'ember';

export function anyTrue(params) {
    return params.reduce((prev, current) => prev || current, false);
}

export default Ember.Helper.helper(anyTrue);
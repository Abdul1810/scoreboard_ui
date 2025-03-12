import Ember from 'ember';

export function coalesce(params) {
    for (let i = 0; i < params.length; i++) {
        if (params[i] !== null && params[i] !== undefined) {
            return params[i];
        }
    }
    return null;
}

export default Ember.Helper.helper(coalesce);
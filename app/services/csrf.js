import Ember from 'ember';

export default Ember.Service.extend({
    csrfToken: null,

    setToken(newToken) {
        this.set('csrfToken', newToken);
    },

    clearToken() {
        this.set('csrfToken', null);
    },

    getToken() {
        return this.get('csrfToken');
    }
});
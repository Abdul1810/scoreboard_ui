import Ember from 'ember';

export default Ember.Service.extend({
    csrfToken: null,
    username: null,

    setToken(newToken) {
        this.set('csrfToken', newToken);
    },

    setUsername(newUsername) {
        this.set('username', newUsername);
    },

    clearAll() {
        this.set('csrfToken', null);
        this.set('username', null);
    },

    getToken() {
        return this.get('csrfToken');
    },

    getUsername() {
        return this.get('username');
    },
});
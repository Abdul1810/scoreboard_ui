import Ember from 'ember';

export default Ember.Route.extend({
    auth: Ember.inject.service(),
    router: Ember.inject.service(),
    init() {
        this._super(...arguments);
        this.get('router').on('willTransition', (transition) => {
            this.handleRouteChange(transition);
        });
    },

    handleRouteChange(transition) {
        const currentRouteName = transition.targetName;
        console.log('Route changing to:', currentRouteName);

        const allowedRoutes = ['login', 'register', 'embed'];
        if (!allowedRoutes.includes(currentRouteName)) {
            this.verifyUser();
        }
    },

    verifyUser() {
        const csrf = this.get('auth');
        if (!csrf.getToken()) {
            console.log('CSRF token not found, sending verification request...');
            Ember.$.ajax({
                url: `http://localhost:8080/api/auth/verify`,
                type: 'POST',
                dataType: 'json',
            })
                .done((data) => {
                    if (data.error) {
                        console.error('Verification failed:', data.error);
                    } else {
                        console.log('Verification succeeded, setting CSRF token');
                        csrf.setToken(data.csrfToken);
                        csrf.setUsername(data.username);
                    }
                })
                .fail(() => {
                    console.error('Verification request failed');
                });
        }
    },

    willDestroy() {
        this._super(...arguments);
        this.get('router').off('willTransition', this.handleRouteChange);
    }
});

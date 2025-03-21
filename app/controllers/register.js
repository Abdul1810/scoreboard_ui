import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['redirect'],
    redirect: null,
    auth: Ember.inject.service(),
    errorMessage: null,
    actions: {
        register() {
            const username = this.get('username');
            const password = this.get('password');
            const confirmPassword = this.get('confirmPassword');

            if (password !== confirmPassword) {
                this.set('errorMessage', 'Passwords do not match.');
                return;
            }

            Ember.$.ajax({
                url: 'http://localhost:8080/api/auth/register',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ username, password }),
                contentType: 'application/json'
            })
                .done((data) => {
                    if (data.error) {
                        this.set('errorMessage', data.error);
                    } else {
                        this.set('errorMessage', data.message);
                        const csrf = this.get('auth');
                        if (data.csrfToken) {
                            csrf.setToken(data.csrfToken);
                            csrf.setUsername(data.username);
                        }
                        const redirect = this.get('redirect');
                        if (redirect) {
                            window.location.href = redirect;
                        } else {
                            this.transitionToRoute('match.index');
                        }
                    }
                })
                .fail((error) => {
                    this.set('errorMessage', error.responseJSON && error.responseJSON.error);
                });
        }
    }
});

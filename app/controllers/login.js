import Ember from 'ember';

export default Ember.Controller.extend({
    queryParams: ['redirect'],
    redirect: null,
    errorMessage: null,
    actions: {
        login() {
            const username = this.get('username');
            const password = this.get('password');

            Ember.$.ajax({
                url: 'http://localhost:8080/api/auth/login',
                type: 'POST',
                dataType: 'json',
                data: JSON.stringify({ username, password }),
                contentType: 'application/json'
            })
                .done((data) => {
                    if (data.error) {
                        this.set('errorMessage', data.error);
                    } else {
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

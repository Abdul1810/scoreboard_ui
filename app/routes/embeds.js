import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return new Ember.RSVP.Promise((resolve) => {
            Ember.$.ajax({
                url: `http://localhost:8080/api/embed`,
                type: 'GET',
                dataType: 'json',
            })
                .done((data) => resolve(data))
                .fail((error) => {
                    resolve({ error: true, message: error.responseJSON && error.responseJSON.message });
                });
        });
    },

    setupController(controller, model) {
        this._super(controller, model);
        if (model.error) {
            controller.set('resultMessage', model.message);
        } else {
            controller.set('resultMessage', null);
            controller.set('embeds', model.embeds);
        }
    },
});

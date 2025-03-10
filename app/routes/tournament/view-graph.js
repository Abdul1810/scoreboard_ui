import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return new Ember.RSVP.Promise((resolve) => {
            Ember.$.ajax({
                url: `http://localhost:8080/api/tournaments?id=${params.tournament_id}`,
                type: 'GET',
                dataType: 'json'
            })
                .done((data) => resolve(data))
                .fail((error) => {
                    resolve({ error: true, message: error.responseJSON && error.responseJSON.message });
                });
        });
    },
    setupController(controller, model) {
        this._super(controller, model);
        controller.set('matches', Ember.A([]));
        controller.set('winners', Ember.A([]));
        model.matches.forEach((match) => {
            controller.get('matches').pushObject(match);
            controller.get('winners').pushObject(match.winner);
        });
        Ember.run.scheduleOnce('afterRender', controller, controller.drawBracket);
    },

});

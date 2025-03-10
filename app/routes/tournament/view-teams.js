import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return new Ember.RSVP.Promise((resolve) => {
            Ember.$.ajax({
                url: `http://localhost:8080/api/tournaments/teams?id=${params.tournament_id}`,
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
        controller.set('tournamentId', this.paramsFor('tournament.view-teams').tournament_id);
        if (model.error) {
            controller.set('resultMessage', model.message);
            controller.set('resultColor', 'red');
            return;
        } else {
            controller.set('resultMessage', '');
            controller.set('resultColor', 'blue');
            controller.set('teams', model.teams);
        }
    },
});

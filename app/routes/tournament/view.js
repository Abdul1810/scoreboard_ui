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
        if (model.error) {
            controller.set('resultMessage', model.message);
            controller.set('resultColor', 'red');
        } else {
            controller.set('tournament', model);
            controller.set('upcomingMatches', Ember.A([]));
            controller.set('completedMatches', Ember.A([]));
            model.matches.forEach((match) => {
                if (match.is_completed === 'false') {
                        controller.get('upcomingMatches').pushObject(match);
                } else {
                    controller.get('completedMatches').pushObject(match);
                }
            });
            controller.set('upcomingMatches', controller.get('upcomingMatches').sort((a, b) => a.id - b.id));
            if (controller.get('upcomingMatches').length > 0) {
                controller.set('ongoingMatches', controller.get('upcomingMatches').objectAt(0));
                controller.get('upcomingMatches').removeAt(0);
                console.log(controller.get('ongoingMatches'));
                console.log(controller.get('upcomingMatches'));
            }

            if (model.status === "completed") {
                controller.set('resultMessage', `${model.winner} won the tournament`);
                controller.set('resultColor', "green");
            }
        }
    }
});

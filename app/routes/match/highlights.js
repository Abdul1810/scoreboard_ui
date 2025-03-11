import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return new Ember.RSVP.Promise((resolve) => {
            Ember.$.ajax({
                url: `http://localhost:8080/api/highlights?id=${params.match_id}`,
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
        this._super(...arguments);
        controller.setProperties({
            team1_balls: [],
            team2_balls: [],
            team1_players: [],
            team2_players: [],
            team1: "",
            team2: "",
        });
        if (model.error) {
            window.history.back();
        } else {
            controller.set('team1_balls', model.team1_balls);
            controller.set('team2_balls', model.team2_balls);
            controller.set('team1_players', model.team1_players);
            controller.set('team2_players', model.team2_players);
            controller.set('team1', model.team1);
            controller.set('team2', model.team2);
        }
    }
});

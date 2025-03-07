import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        // {"winner":"csk","name":"IPL '25","created_at":"2025-03-07 14:23:23","id":11,"matches":[{"winner":"csk","name":"csk vs dc","id":89,"is_completed":"true"},{"winner":"mi","name":"kkr vs mi","id":90,"is_completed":"true"},{"winner":"rcb","name":"pbks vs rcb","id":91,"is_completed":"true"},{"winner":"srh","name":"rr vs srh","id":92,"is_completed":"true"},{"winner":"csk","name":"csk vs mi","id":93,"is_completed":"true"},{"winner":"rcb","name":"rcb vs srh","id":94,"is_completed":"true"},{"winner":"csk","name":"csk vs rcb","id":95,"is_completed":"true"}],"status":"completed"}
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

import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return new Ember.RSVP.Promise((resolve) => {
      Ember.$.ajax({
        url: `http://localhost:8080/api/matches?id=${params.match_id}`,
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
      controller.set('result', model.message);
    } else {
      document.title = `${model.team1} vs ${model.team2}`;
      controller.set('team1Players', model.team1_players);
      controller.set('team2Players', model.team2_players);
      controller.set('team1', model.team1);
      controller.set('team2', model.team2);
      controller.initWebSocket(model.id);
    }
  }
});

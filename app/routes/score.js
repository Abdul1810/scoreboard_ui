import Ember from 'ember';

export default Ember.Route.extend({
  queryParams: {
    view: {
      refreshModel: true
    }
  },
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
    controller.setProperties({
      current_batting: "team1",
      team1: "",
      team2: "",
      team1Players: Ember.A([]),
      team2Players: Ember.A([]),
      team1Runs: Ember.A([]),
      team2Runs: Ember.A([]),
      team1Balls: Ember.A([]),
      team2Balls: Ember.A([]),
      team1WicketsMap: Ember.A([]),
      team2WicketsMap: Ember.A([]),
      team1Wickets: Ember.A([]),
      team2Wickets: Ember.A([]),
      result: "",
      matchResult: "",
      team1Stats: "",
      team2Stats: "",
      team1StatsBackground: "white",
      team2StatsBackground: "white",
      active_batsman_index: 0,
      passive_batsman_index: 0,
      striker1: "",
      striker2: "",
      nonStriker1: "",
      nonStriker2: "",
      bowler1: "",
      bowler2: "",
      team1TotalBalls: Ember.A([]),
      team2TotalBalls: Ember.A([]),
      highlightsPath: null,
    });
    if (model.error) {
      controller.set('result', model.message);
    } else {
      document.title = `${model.team1} vs ${model.team2}`;
      controller.set('team1Players', model.team1_players);
      controller.set('team2Players', model.team2_players);
      controller.set('team1', model.team1);
      controller.set('team2', model.team2);
      controller.set('highlightsPath', model.highlights_path);
      controller.initWebSocket(model.id);
    }
  },

  actions: {
    willTransition() {
      this.controllerFor('score').set('shouldReconnect', false);
      this.controllerFor('score').disconnectWebSocket();
      return true;
    }
  }
});

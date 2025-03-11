import Ember from 'ember';

export default Ember.Route.extend({
  model(params) {
    return Ember.$.getJSON(`http://localhost:8080/api/teams?id=${params.team_id}`)
      .then(team => {
        return {
          id: team.id,
          name: team.name,
          players: team.players
        };
      })
      .fail(error => {
        console.error("Fetch Error:", error);
        return { error: "Failed to load team details." };
      });
  },

  setupController(controller, model) {
    this._super(controller, model);
    controller.set('tournaments', null);
    controller.set('resultMessage', null);
    if (model.name) {
      document.title = `Team ${model.name}`;
    } else {
      document.title = "Team Details";
    }
  }
});

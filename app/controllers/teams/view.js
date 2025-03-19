import Ember from 'ember';

export default Ember.Controller.extend({
  resultMessage: null,
  tournaments: null,
  tournamentsPresent: Ember.computed('tournaments.[]', function() {
    return this.get('tournaments') !== null && this.get('tournaments').length > 0;
  }),
  actions: {
    calculateScore(player) {
      this.set('resultMessage', "Loading...");
      this.set('tournaments', null);
      Ember.$.getJSON(`http://localhost:8080/api/total-score?player=${player}&teamId=${this.get('model.id')}`)
        .then(data => {
          this.set('resultMessage', `${player} has scored ${data.total_score} runs<br>Balls faced: ${data.total_balls}<br>Matches played: ${data.matches_played}${data.tournaments.length === 0 ? "<br>No tournaments played" : "<br><span style='color:black'>Tournaments Played</span>"}`);
          this.set('tournaments', data.tournaments);
        })
        .fail(error => {
          console.error("Fetch Error:", error);
          this.set('resultMessage', "Failed to load score.");
        });
    },
    calculateWickets(player) {
      this.set('resultMessage', "Loading...");
      this.set('tournaments', null);
      Ember.$.getJSON(`http://localhost:8080/api/total-wickets?player=${player}&teamId=${this.get('model.id')}`)
        .then(data => {
          this.set('resultMessage', `${player} has taken ${data.total_wickets} wickets<br>Balls bowled: ${data.balls_bowled}<br>Matches played: ${data.matches_bowled}`);
        })
        .fail(error => {
          console.error("Fetch Error:", error);
          this.set('resultMessage', "Failed to load wickets.");
        });
    }
  }
});

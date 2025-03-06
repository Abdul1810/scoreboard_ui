import Ember from 'ember';

export default Ember.Controller.extend({
  resultMessage: null,

  actions: {
    calculateScore(player) {
      this.set('resultMessage', "Loading...");

      Ember.$.getJSON(`http://localhost:8080/api/total-score?player=${player}&teamId=${this.get('model.id')}`)
        .then(data => {
          this.set('resultMessage', `${player} has scored ${data.total_score} runs\nBalls faced: ${data.total_balls}\nMatches played: ${data.matches_played}`);
        })
        .fail(error => {
          console.error("Fetch Error:", error);
          this.set('resultMessage', "Failed to load score.");
        });
    },

    calculateWickets(player) {
      this.set('resultMessage', "Loading...");

      Ember.$.getJSON(`http://localhost:8080/api/total-wickets?player=${player}&teamId=${this.get('model.id')}`)
        .then(data => {
          this.set('resultMessage', `${player} has taken ${data.total_wickets} wickets\nBalls bowled: ${data.balls_bowled}\nMatches played: ${data.matches_bowled}`);
        })
        .fail(error => {
          console.error("Fetch Error:", error);
          this.set('resultMessage', "Failed to load wickets.");
        });
    }
  }
});

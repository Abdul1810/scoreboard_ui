import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'div',
  classNames: ['team-stats'],
  team: null,
  score: null,
  striker: null,
  nonstriker: null,
  bowler: null,
  backgroundColor: 'white',
  buttonsDisabled: false,
  outDisabled: false,

  actions: {
    updateScore(value) {
      this.sendAction('updateScore', value, this.get('team'));
    }
  }
});

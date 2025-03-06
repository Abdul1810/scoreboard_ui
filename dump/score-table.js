import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'table',
  classNames: ['score-table'],
  players: [],
  runs: [],
  balls: [],
  wickets: []
});

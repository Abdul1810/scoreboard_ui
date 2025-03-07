import Ember from 'ember';

export default Ember.Controller.extend({
    tournament: {},
    upcomingMatches: [],
    completedMatches: [],
    resultMessage: "",
    resultColor: "green",
    ongoingMatches: {},
});

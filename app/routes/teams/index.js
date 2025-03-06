import Ember from 'ember';

export default Ember.Route.extend({
    model: function() {
        return Ember.$.getJSON('http://localhost:8080/api/teams');
    }
});
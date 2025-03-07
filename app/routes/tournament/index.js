import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return Ember.$.getJSON('http://localhost:8080/api/tournaments');
    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set('tournaments', model.tournaments);
    }
});

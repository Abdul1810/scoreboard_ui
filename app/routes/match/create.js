import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return Ember.$.get('http://localhost:8080/api/teams');
    },

    setupController(controller, model) {
        this._super(controller, model);
        controller.set('teams', model);
    }
});

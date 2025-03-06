import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        id: {
            refreshModel: true
        }
    },

    model(params) {
        return Ember.$.getJSON(`http://localhost:8080/old/api/matches?id=${params.id}`);
    },

    setupController(controller, model) {
        this._super(controller, model);
    },
});

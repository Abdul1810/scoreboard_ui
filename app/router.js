import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('score', { path: '/score/:match_id' });
  this.route('teams', function () {
    this.route('index', { path: '/' });
    this.route('create', { path: '/create' });
    this.route('view', { path: '/:team_id' });
  });
  this.route('match', function () {
    this.route('index', { path: '/' });
    this.route('create', { path: '/create' });
    this.route('edit', { path: '/:match_id' });
  });
  this.route('tournament', function () {
    this.route('index', { path: '/' });
    this.route('create', { path: '/create' });
    this.route('view', { path: '/:tournament_id' });
    this.route('view-graph', { path: '/:tournament_id/graph' });
    this.route('view-teams', { path: '/:tournament_id/teams' });
    this.route('view-stats');
  });
});

export default Router;

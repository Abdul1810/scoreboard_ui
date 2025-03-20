import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('index', { path: '/' });
  this.route('login', { path: '/login' });
  this.route('embed', { path: '/embed' });
  this.route('embeds', { path: '/embeds' });
  this.route('teams', function () {
    this.route('index', { path: '/' });
    this.route('create', { path: '/create' });
    this.route('view', { path: '/:team_id' });
  });
  this.route('match', function () {
    this.route('index', { path: '/' });
    this.route('create', { path: '/create' });
    this.route('edit', { path: '/:match_id' });
    this.route('highlights', { path: '/:match_id/highlights' });
  });
  this.route('tournament', function () {
    this.route('index', { path: '/' });
    this.route('create', { path: '/create' });
    this.route('view', { path: '/:tournament_id' });
    this.route('view-graph', { path: '/:tournament_id/graph' });
    this.route('view-teams', { path: '/:tournament_id/teams' });
  });
});

export default Router;

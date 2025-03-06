import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function () {
  this.route('index', { path: '/' });
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
  this.route('score', { path: '/score/:match_id' });
});

export default Router;

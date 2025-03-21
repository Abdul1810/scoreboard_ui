import Ember from 'ember';

export function initialize() {
  Ember.$.ajaxSetup({
    xhrFields: {
      withCredentials: true
    },
    complete: (req) => {
      if (req.status === 401) {
        console.warn(`Request failed with status ${req.status}. Redirecting to login...`);
        const oldUrl = window.location.href;
        location.href = "/login?redirect=" + encodeURIComponent(oldUrl);
      }
    }
  });
}

export default {
  initialize
};

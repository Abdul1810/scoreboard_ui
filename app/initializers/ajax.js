import Ember from 'ember';

export function initialize() {
  Ember.$.ajaxSetup({
    xhrFields: {
      withCredentials: true
    },
    complete: (jqXHR) => {
      if (jqXHR.status === 401 || jqXHR.status === 403) {
        console.warn(`Request failed with status ${jqXHR.status}. Redirecting to login...`);
        const currentQueryString = window.location.search;
        location.href = "/login" + currentQueryString;
      }
    }
  });
}

export default {
  initialize
};

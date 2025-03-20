import Ember from 'ember';

export default Ember.Controller.extend({
  slicedTeams: Ember.computed('model', function() {
    return this.get('model').map(team => {
      return {
        id: team.id,
        name: team.name,
        logo: team.logo,
        firstHalf: team.players.slice(0, 6),
        secondHalf: team.players.slice(6, 11)
      };
    });
  }),

  actions: {
    deleteTeam(teamId) {
      if (confirm("Are you sure you want to delete this team?")) {
        Ember.$.ajax({
          url: `http://localhost:8080/api/teams?id=${teamId}`,
          type: 'DELETE',
          headers: {
            'X-CSRF-Token': this.get('auth').getToken()
          },
          dataType: 'json',
        })
          .done(() => {
            this.set('model', this.get('model').filter(team => team.id !== teamId));
          })
          .fail((error) => {
            console.error("Delete Error:", error);
          });
      }
    }
  }
});

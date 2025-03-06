import Ember from 'ember';

export default Ember.Controller.extend({
  slicedTeams: Ember.computed('model', function() {
    return this.get('model').map(team => {
      return {
        id: team.id,
        name: team.name,
        firstHalf: team.players.slice(0, 6),
        secondHalf: team.players.slice(6, 11)
      };
    });
  }),

  actions: {
    deleteTeam(teamId) {
      if (confirm("Are you sure you want to delete this team?")) {
        fetch(`http://localhost:8080/api/teams?id=${teamId}`, { method: 'DELETE' })
          .then(response => response.json())
          .then(() => {
            this.set('model', this.get('model').filter(team => team.id !== teamId));
          })
          .catch(error => {
            console.error("Delete Error:", error);
          });
      }
    }
  }
});

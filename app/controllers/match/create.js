import Ember from 'ember';

export default Ember.Controller.extend({
  auth: Ember.inject.service(),
  teams: [],
  selectedTeam1: null,
  selectedTeam2: null,
  resultMessage: '',
  resultColor: '',

  filteredTeams: Ember.computed('teams', 'selectedTeam1', function () {
    console.log('selectedTeam1 changed');
    let selectedTeam1 = parseInt(this.get('selectedTeam1'));
    let teams = this.get('teams') || [];
    if (!selectedTeam1) {
      return teams;
    }

    return teams.filter(team => team.id !== selectedTeam1);
  }),
  
  actions: {
    selectTeam1(teamId) {
      this.set('selectedTeam1', teamId);
      if (this.get('selectedTeam2') === teamId) {
        this.set('selectedTeam2', null);
      }
    },
    selectTeam2(teamId) {
      this.set('selectedTeam2', teamId);
    },
    addMatch() {
      let team1 = this.get('selectedTeam1');
      let team2 = this.get('selectedTeam2');

      if (!team1 || !team2) {
        this.setProperties({
          resultMessage: "Both teams are required!",
          resultColor: "red"
        });
        return;
      }

      this.setProperties({
        resultMessage: "Creating match...",
        resultColor: "blue"
      });

      let newMatch = { team1: `${team1}`, team2: `${team2}` };

      let controller = this;
      Ember.$.ajax({
        url: 'http://localhost:8080/api/matches',
        type: 'POST',
        headers: {
          'X-CSRF-Token': this.get('auth').getToken()
        },
        contentType: 'application/json',
        data: JSON.stringify(newMatch)
      })
        .done(function (data) {
          controller.setProperties({
            resultMessage: data.message + ". Redirecting...",
            resultColor: "green"
          });
          setTimeout(() => {
            controller.transitionToRoute('match.edit', data.id);
          }, 1500);
        })
        .fail(function (error) {
          console.error("Error creating match:", error);
          controller.setProperties({
            resultMessage: "Error creating match!",
            resultColor: "red"
          });
        });
    }
  }
});

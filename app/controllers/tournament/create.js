import Ember from 'ember';

export default Ember.Controller.extend({
    teams: [],
    selectedTeams: Ember.A([]),
    selectedTeam: null,
    resultMessage: '',
    resultColor: '',
    name: '',
    selectedTeamNames: Ember.computed('selectedTeams.@each', 'teams', function () {
        let selectedTeams = this.get('selectedTeams');
        let teams = this.get('teams') || [];
        return teams.filter(team => selectedTeams.includes(team.id));
    }
    ),
    filteredTeams: Ember.computed('selectedTeams.@each', 'teams', function () {
        let selectedTeams = this.get('selectedTeams');
        let teams = this.get('teams') || [];
        if (!selectedTeams.length) {
            return teams;
        }

        return teams.filter(team => !selectedTeams.includes(team.id));
    }),

    actions: {
        selectAllTeams() {
            let teams = this.get('teams').mapBy('id');
            this.set('selectedTeams', Ember.A(teams.slice(0, 8)));
        },
        selectTeam(teamId) {
            let selectedTeams = this.get('selectedTeams').slice();

            if (selectedTeams.includes(teamId)) {
                selectedTeams.removeObject(parseInt(teamId));
            } else {
                selectedTeams.addObject(parseInt(teamId));
            }

            this.set('selectedTeams', Ember.A(selectedTeams));
        },
        addTournament() {
            let selectedTeams = this.get('selectedTeams');

            if (selectedTeams.length !== 8) {
                this.setProperties({
                    resultMessage: "Please select 8 teams",
                    resultColor: "red"
                });
                return;
            }

            this.setProperties({
                resultMessage: "Creating tournament...",
                resultColor: "blue"
            });

            let newTournament = { teams: selectedTeams, name: this.get('name') };

            let controller = this;
            Ember.$.ajax({
                url: 'http://localhost:8080/api/tournaments',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newTournament)
            })
                .done(function (data) {
                    console.log("data", data);
                    controller.setProperties({
                        resultMessage: "Tournament created successfully!",
                        resultColor: "green"
                    });
                })
                .fail(function (jqXHR) {
                    console.error(jqXHR);
                    controller.setProperties({
                        resultMessage: jqXHR.responseJSON.error,
                        resultColor: "red"
                    });
                });
        }
    }
});

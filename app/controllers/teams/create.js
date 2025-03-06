import Ember from 'ember';

export default Ember.Controller.extend({
    teamName: '',
    players: Array(11).fill(''),
    resultMessage: '',
    resultColor: '',

    actions: {
        fillPlayers() {
            const players = [
                "Abdul", "Rahman", "Manoj", "Vishnu", "Saran", "Siva",
                "Satish", "Suresh", "Rajesh", "Kumar", "Ravi"
            ];
            players.sort(() => Math.random() - 0.5);
            this.set('players', players);
        },

        addTeam() {
            this.setProperties({
                resultMessage: "Creating team...",
                resultColor: "blue"
            });

            const newTeam = {
                name: this.get('teamName'),
                players: this.get('players')
            };

            Ember.$.ajax({
                url: 'http://localhost:8080/api/teams',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(newTeam)
            })
                .done((data) => {
                    this.setProperties({
                        resultMessage: data.message,
                        resultColor: "green"
                    });
                })
                .fail((error) => {
                    let errorMessage = (error.responseJSON && error.responseJSON.message) ?
                        error.responseJSON.message :
                        "Something went wrong";
                    this.setProperties({
                        resultMessage: errorMessage,
                        resultColor: "red"
                    });
                });
        }
    }
});

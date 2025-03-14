import Ember from 'ember';

export default Ember.Controller.extend({
    teamName: '',
    teamLogo: null,
    teamLogoURL: '',
    players: Array(11).fill(''),
    playerAvatars: Ember.A(Array(11).fill(null)),
    playerAvatarURLs: Ember.A(Array(11).fill('')),
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

            // multipart/form-data
            const formData = new FormData();
            formData.append('name', this.get('teamName'));
            formData.append('logo', this.get('teamLogo'));
            this.get('playerAvatars').forEach((avatar) => {
                formData.append('avatars', avatar);
            });
            this.get('players').forEach((player) => {
                formData.append('players', player);
            });

            Ember.$.ajax({
                url: 'http://localhost:8080/api/teams',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false
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
        },

        triggerUpload() {
            Ember.$('#team-logo').click();
        },

        uploadLogo(files) {
            if (files && files.length > 0) {
                let file = files[0];
                this.set('teamLogo', file);
                let reader = new FileReader();

                reader.onload = (e) => {
                    this.set('teamLogoURL', e.target.result);
                };

                reader.readAsDataURL(file);
            }
        },

        uploadAvatars(files) {
            if (files && files.length > 0) {
                let playerAvatars = this.get('playerAvatars') || [];
                let urls = Ember.A(Array(11).fill(''));

                for (let i = 0; i < Math.min(files.length, 11); i++) {
                    let file = files[i];
                    playerAvatars[i] = file;

                    let reader = new FileReader();
                    reader.onload = (e) => {
                        urls[i] = e.target.result;
                        this.set('playerAvatarURLs', urls);
                        this.notifyPropertyChange('playerAvatarURLs');
                    };
                    reader.readAsDataURL(file);
                }

                this.set('playerAvatars', playerAvatars);
            }
        },

        removeLogo() {
            this.set('teamLogoURL', '');
            this.set('teamLogo', null);
        }
    }
});

import Ember from 'ember';

export default Ember.Controller.extend({
    embeds: Ember.A([]),
    resultMessage: null,
    actions: {
        deleteEmbed(id) {
            Ember.$.ajax({
                url: `http://localhost:8080/api/embed/${id}`,
                type: 'DELETE',
                dataType: 'json',
            })
                .done((data) => {
                    this.set('resultMessage', data.message);
                    this.set('embeds', this.get('embeds').rejectBy('id', id));
                })
                .fail((error) => {
                    this.set('errorMessage', error.responseJSON && error.responseJSON.message);
                });
        },
        copyCode(embedId) {
            const embed = this.get('embeds').findBy('id', embedId);
            if (!embed) {
                this.set('resultMessage', 'Embed not found');
                return;
            }
            const verificationCode = embed.embed_code;
            if (!verificationCode) {
                this.set('resultMessage', 'Verification code not found');
                return;
            }
            const code = `<iframe src="http://localhost:4200/embed?verificationCode=${verificationCode}" width="100%" height="600px" frameborder="0" title="${embed.team1} vs ${embed.team2}"></iframe>`;
            navigator.clipboard.writeText(code).then(() => {
                this.set('resultMessage', 'Code copied to clipboard');
            }).catch((error) => {
                this.set('resultMessage', error);
            });
        }
    }
});

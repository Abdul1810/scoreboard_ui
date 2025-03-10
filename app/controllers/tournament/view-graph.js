import Ember from 'ember';

export default Ember.Controller.extend({
    matches: [],
    winners: [],

    drawBracket() {
        const matches = this.get('matches');
        const winners = this.get('winners');
        for (let i = 0; i < matches.length; i++) {
            const matchElement = document.getElementById(`match${i + 1}`);
            if (matchElement) {
                matchElement.innerHTML = `${matches[i].name}<br>Winner: ${winners[i]}`;
            }
        }
        const svg = document.getElementById("connections");

        function connectMatches(id1, id2, svg) {
            const box1 = document.getElementById(id1).getBoundingClientRect();
            const box2 = document.getElementById(id2).getBoundingClientRect();
            const container = document.querySelector(".bracket-container").getBoundingClientRect();

            const x1 = box1.right - container.left;
            const y1 = box1.top + box1.height / 2 - container.top;
            const x2 = box2.left - container.left;
            const y2 = box2.top + box2.height / 2 - container.top;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            svg.appendChild(line);
        }

        connectMatches("match1", "match5", svg);
        connectMatches("match2", "match5", svg);
        connectMatches("match3", "match6", svg);
        connectMatches("match4", "match6", svg);
        connectMatches("match5", "match7", svg);
        connectMatches("match6", "match7", svg);
    },
});

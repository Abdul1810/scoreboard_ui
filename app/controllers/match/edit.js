import Ember from 'ember';

export default Ember.Controller.extend({
  socket: null,
  current_batting: "team1",
  is_highlights_uploaded: "false",
  team1: "",
  team2: "",
  team1Players: Ember.A([]),
  team2Players: Ember.A([]),
  team1Runs: Ember.A([]),
  team2Runs: Ember.A([]),
  team1Balls: Ember.A([]),
  team2Balls: Ember.A([]),
  team1WicketsMap: Ember.A([]),
  team2WicketsMap: Ember.A([]),
  team1Wickets: Ember.A([]),
  team2Wickets: Ember.A([]),
  result: "",
  matchResult: "",
  team1Stats: "",
  team2Stats: "",
  team1StatsBackground: "white",
  team2StatsBackground: "white",
  active_batsman_index: 0,
  passive_batsman_index: 0,
  active_bowler_index: 0,
  striker1: "",
  striker2: "",
  nonStriker1: "",
  nonStriker2: "",
  bowler1: "",
  bowler2: "",
  reconnectInterval: 3000,
  team1TotalBalls: 0,
  team2TotalBalls: 0,
  selectedFileName: "",
  is_completed: "false",
  needChoosingBatsmanTeam1: false,
  needChoosingBatsmanTeam2: false,
  needChoosingPassiveTeam1: false,
  needChoosingPassiveTeam2: false,
  needChoosingBowlerTeam1: false,
  needChoosingBowlerTeam2: false,
  notOutPlayersTeam1: {},
  notOutPlayersTeam2: {},
  selected1stBatsman: "",
  isNoball: false,

  initWebSocket(matchId) {
    const socketUrl = `ws://localhost:8080/ws/stats?id=${matchId}`;
    this.set('socket', new WebSocket(socketUrl));

    const socket = this.get('socket');

    socket.onopen = () => {
      console.log('Connected to the server');
      this.set('result', "Live Connected");
    };

    socket.onmessage = (event) => {
      if (event.data === "not-found") {
        window.location.reload();
      }
      const data = JSON.parse(event.data);
      console.log(data);
      this.updateScoreTable(data);
      this.set('isNoball', false);
      this.set('current_batting', data.current_batting);
      this.set('is_highlights_uploaded', data.is_highlights_uploaded);
      this.set('is_completed', data.is_completed);
      this.set('team1Stats', `${data.team1_score}/${data.team2_wickets} (${data.team1_balls})`);
      this.set('team2Stats', `${data.team2_score}/${data.team1_wickets} (${data.team2_balls})`);

      let team1BallDistribution = distributeBalls(data.team2_bowling_order, data.team1_balls);
      let team2BallDistribution = distributeBalls(data.team1_bowling_order, data.team2_balls);


      this.set('team1TotalBalls', Ember.A(team1BallDistribution));
      this.set('team2TotalBalls', Ember.A(team2BallDistribution));

      if (data.is_completed === "false") {
        this.handleMatchInProgress(data);
      } else {
        this.handleMatchCompleted(data);
      }
    };

    function distributeBalls(overArray, totalBalls) {
      let ballsArray = Array(11).fill(0);
      let balls = totalBalls;
      for (let i = 0; i < overArray.length; i++) {
        if (balls >= 6) {
          ballsArray[overArray[i] - 1] += 6;
          balls -= 6;
        } else {
          ballsArray[overArray[i] - 1] += balls;
          break;
        }
      }
      return ballsArray;
    }

    socket.onclose = () => {
      this.set('result', "Connection closed. Attempting to reconnect...");
      setTimeout(() => {
        this.initWebSocket(matchId);
      }, this.reconnectInterval);
    };

    socket.onerror = () => {
      this.set('result', "Connection error. Attempting to reconnect...");
      socket.close();
    };
  },

  disconnectWebSocket() {
    const socket = this.get('socket');
    if (socket !== null && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
  },

  handleMatchInProgress(data) {
    this.setProperties({
      active_batsman_index: data.active_batsman_index,
      passive_batsman_index: data.passive_batsman_index,
      active_bowler_index: data.active_bowler_index,
    });

    const isTeam1Batting = data.current_batting === "team1";
    const battingTeam = isTeam1Batting ? this.team1Players : this.team2Players;
    // const bowlerName = this.getBowlerName(isTeam1Batting ? data.team1_balls : data.team2_balls);
    const bowlerName = data.active_bowler_index === -1 ? "Select Bowler" :
      isTeam1Batting ? this.get('team2Players')[data.active_bowler_index - 1] : this.get('team1Players')[data.active_bowler_index - 1];

    this.setProperties({
      matchResult: data.active_batsman_index === -1 ? "Waiting for Batsman" : `${battingTeam[data.active_batsman_index - 1]} is batting\n${data.passive_batsman_index === -1 ? "Waiting for Batsman" : `${battingTeam[data.passive_batsman_index - 1]} is waiting`}`,
      team1StatsBackground: isTeam1Batting ? "aliceblue" : "white",
      team2StatsBackground: isTeam1Batting ? "white" : "aliceblue",
    });

    if (data.current_batting === "team1") {
      if (data.team1_freehits_map.includes((parseInt(data.team1_balls) + 1))) {
        this.set('matchResult', "Free Hit");
      }
    } else if (data.current_batting === "team2") {
      if (data.team2_freehits_map.includes((parseInt(data.team2_balls) + 1))) {
        this.set('matchResult', "Free Hit");
      }
    }

    if (data.active_batsman_index === -1) {
      if (data.current_batting === "team1") {
        this.set('needChoosingBatsmanTeam1', true);
        let notOutPlayerIndicesTeam1 = data.team1_wickets_map.map((wicket, index) => {
          if (wicket === null && index !== data.passive_batsman_index - 1) {
            return index;
          }
        }).filter((index) => index !== undefined);
        let notOutPlayersTeam1 = notOutPlayerIndicesTeam1.map((index) => {
          return { name: battingTeam[index], index: index + 1 };
        });
        this.set('notOutPlayersTeam1', notOutPlayersTeam1);
      } else if (data.current_batting === "team2") {
        this.set('needChoosingBatsmanTeam2', true);
        let notOutPlayerIndicesTeam2 = data.team2_wickets_map.map((wicket, index) => {
          if (wicket === null && index !== data.passive_batsman_index - 1) {
            return index;
          }
        }).filter((index) => index !== undefined);
        let notOutPlayersTeam2 = notOutPlayerIndicesTeam2.map((index) => {
          return { name: battingTeam[index], index: index + 1 };
        });
        this.set('notOutPlayersTeam2', notOutPlayersTeam2);
      }
    } else {
      this.set('needChoosingBatsmanTeam1', false);
      this.set('needChoosingBatsmanTeam2', false);
    }

    if (data.active_bowler_index === -1) {
      if (data.current_batting === "team1") {
        this.set('needChoosingBowlerTeam2', true);
      } else if (data.current_batting === "team2") {
        this.set('needChoosingBowlerTeam1', true);
      }
    } else {
      this.set('needChoosingBowlerTeam1', false);
      this.set('needChoosingBowlerTeam2', false);
    }

    if (data.passive_batsman_index === -1) {
      if (data.current_batting === "team1") {
        this.set('needChoosingPassiveTeam1', true);
        let notOutPlayerIndicesTeam1 = data.team1_wickets_map.map((wicket, index) => {
          if (wicket === null && index !== data.active_batsman_index - 1) {
            return index;
          }
        }).filter((index) => index !== undefined);
        let notOutPlayersTeam1 = notOutPlayerIndicesTeam1.map((index) => {
          return { name: battingTeam[index], index: index + 1 };
        });
        this.set('notOutPlayersTeam1', notOutPlayersTeam1);
      } else if (data.current_batting === "team2") {
        this.set('needChoosingPassiveTeam2', true);
        let notOutPlayerIndicesTeam2 = data.team2_wickets_map.map((wicket, index) => {
          if (wicket === null && index !== data.active_batsman_index - 1) {
            return index;
          }
        }).filter((index) => index !== undefined);
        let notOutPlayersTeam2 = notOutPlayerIndicesTeam2.map((index) => {
          return { name: battingTeam[index], index: index + 1 };
        });
        this.set('notOutPlayersTeam2', notOutPlayersTeam2);
      }
    } else {
      this.set('needChoosingPassiveTeam1', false);
      this.set('needChoosingPassiveTeam2', false);
    }

    this.updateWicketsTable(data);
    this.setProperties(isTeam1Batting ? {
      bowler1: `${bowlerName}`,
      striker1: data.active_batsman_index === -1 ? "Select Batsman" :
        `Batting: ${battingTeam[data.active_batsman_index - 1]}`,
      nonStriker1: data.passive_batsman_index === -1 ? "Select Batsman" :
        `Waiting: ${battingTeam[data.passive_batsman_index - 1]}`,
      bowler2: "",
      striker2: "",
      nonStriker2: ""
    } : {
      bowler2: `${bowlerName}`,
      striker2: data.active_batsman_index === -1 ? "Select Batsman" :
        `Batting: ${battingTeam[data.active_batsman_index - 1]}`,
      nonStriker2: data.passive_batsman_index === -1 ? "Select Batsman" :
        `Waiting: ${battingTeam[data.passive_batsman_index - 1]}`,
      bowler1: "",
      striker1: "",
      nonStriker1: ""
    });
  },

  handleMatchCompleted(data) {
    if (data.winner === undefined) {
      this.set('matchResult', "");
      this.set('team1StatsBackground', "white");
      this.set('team2StatsBackground', "white");
      return;
    }
    this.set('current_batting', "none");
    this.set('matchResult', data.winner !== 'Tie' ? `${data.winner} won the match` : "Tie");
    this.updateWicketsTable(data);
    if (data.winner === "team1") {
      this.set('team1StatsBackground', "lightgreen");
      this.set('team2StatsBackground', "white");
      if (!this.get('team1').includes("Winner")) {
        this.set('team1', this.get('team1') + " (🎉 Winner)");
      }
    } else if (data.winner === "team2") {
      this.set('team2StatsBackground', "lightgreen");
      this.set('team1StatsBackground', "white");
      if (!this.get('team2').includes("Winner")) {
        this.set('team2', this.get('team2') + " (🎉 Winner)");
      }
    } else {
      this.set('team1StatsBackground', "peachpuff");
      this.set('team2StatsBackground', "peachpuff");
    }
  },

  getBowlerName(balls) {
    let bowlerIndex;
    if (balls === 0) {
      return this.get('current_batting') === "team1" ? this.get('team2Players')[0] : this.get('team1Players')[0];
    }
    if (balls <= 66) {
      let over = Math.floor(balls / 6);
      let ball = balls % 6;
      bowlerIndex = over + (ball > 0 ? 1 : 0);
    } else {
      balls -= 66;
      let over = Math.floor(balls / 6);
      let ball = balls % 6;
      bowlerIndex = over + (ball > 0 ? 1 : 0);
    }

    if (bowlerIndex < 0 || bowlerIndex > 11) {
      return "Bowler";
    } else {
      return this.get('current_batting') === "team1" ? this.get('team2Players')[bowlerIndex - 1] : this.get('team1Players')[bowlerIndex - 1];
    }
  },

  updateScoreTable(data) {
    const team1_runs = Object.values(data.team1_runs);
    const team2_runs = Object.values(data.team2_runs);

    this.set('team1Runs', team1_runs);
    this.set('team2Runs', team2_runs);

    this.set('team1Balls', data.team1_balls_map);
    this.set('team2Balls', data.team2_balls_map);

    this.set('team1WicketsMap', data.team1_wickets_map);
    this.set('team2WicketsMap', data.team2_wickets_map);
  },

  updateWicketsTable(data) {
    const team1_outs = Object.values(data.team1_outs);
    const team2_outs = Object.values(data.team2_outs);

    this.set('team1Wickets', team1_outs);
    this.set('team2Wickets', team2_outs);
  },

  actions: {
    updateScore(score) {
      this.set('current_batting', "none");
      const resultData = {
        update: `${score}`,
        is_noball: this.get('isNoball').toString(),
      };
      Ember.$.ajax({
        url: `http://localhost:8080/update-stats?id=${this.get('model.id')}`,
        type: 'PUT',
        data: JSON.stringify(resultData),
        contentType: 'application/json',
        success: (data) => {
          this.set('result', data.message);
        },
        error: (error) => {
          console.error("Error updating score:", error);
          this.set('result', error.responseJSON.message);
          // window.location.reload();
        }
      });
    },
    uploadHighlights(files) {
      this.set('selectedFileName', files[0].name);
      const formData = new FormData();
      formData.append('file', files[0]);
      Ember.$.ajax({
        url: `http://localhost:8080/api/highlights?id=${this.get('model.id')}`,
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: (data) => {
          this.set('result', data.message);
          this.set('is_highlights_uploaded', "true");
        },
        error: (error) => {
          console.error("Error uploading highlights:", error);
          this.set('result', error.responseJSON.message);
        }
      });
    },
    goBack() {
      window.history.back();
    },
    selectBatsman(player) {
      let resultData = {
        player: `${player}`,
      };
      if (!this.get('needChoosingBatsmanTeam1')) {
        if (this.get('needChoosingPassiveTeam1')) {
          resultData = {
            passive: `${player}`,
          };
          Ember.$.ajax({
            url: `http://localhost:8080/api/change-batsman?id=${this.get('model.id')}`,
            type: 'PUT',
            data: JSON.stringify(resultData),
            contentType: 'application/json',
            success: (data) => {
              this.set('result', data.message);
            },
            error: (error) => {
              console.error("Error changing batsman:", error);
              this.set('result', error.responseJSON.message);
            }
          });
          return;
        } else if (!this.get('needChoosingBatsmanTeam2')) {
          if (this.get('needChoosingPassiveTeam2')) {
            resultData = {
              passive: `${player}`,
            };
            Ember.$.ajax({
              url: `http://localhost:8080/api/change-batsman?id=${this.get('model.id')}`,
              type: 'PUT',
              data: JSON.stringify(resultData),
              contentType: 'application/json',
              success: (data) => {
                this.set('result', data.message);
              },
              error: (error) => {
                console.error("Error changing batsman:", error);
                this.set('result', error.responseJSON.message);
              }
            });
            return;
          }
        }
      }
      if (this.get('needChoosingPassiveTeam1') || this.get('needChoosingPassiveTeam2')) {
        if (this.get('selected1stBatsman') === "") {
          this.set('selected1stBatsman', player);
          return;
        } else {
          resultData = {
            player: `${this.get('selected1stBatsman')}`,
            passive: `${player}`,
          };
          this.set('selected1stBatsman', "");
        }
      }
      console.log(resultData);
      Ember.$.ajax({
        url: `http://localhost:8080/api/change-batsman?id=${this.get('model.id')}`,
        type: 'PUT',
        data: JSON.stringify(resultData),
        contentType: 'application/json',
        success: (data) => {
          this.set('result', data.message);
        },
        error: (error) => {
          console.error("Error changing batsman:", error);
          this.set('result', error.responseJSON.message);
        }
      });
    },
    selectBowler(player) {
      const resultData = {
        player: `${parseInt(player) + 1}`,
      };
      Ember.$.ajax({
        url: `http://localhost:8080/api/change-bowler?id=${this.get('model.id')}`,
        type: 'PUT',
        data: JSON.stringify(resultData),
        contentType: 'application/json',
        success: (data) => {
          this.set('result', data.message);
        },
        error: (error) => {
          console.error("Error changing bowler:", error);
          this.set('result', error.responseJSON.message);
        }
      });
    },
    openDialog() {
      let dialog = document.getElementById('matchBannerDialog');
      dialog.showModal();
    },
    closeDialog() {
      let dialog = document.getElementById('matchBannerDialog');
      dialog.close();
    },
    updateNoball() {
      this.set('isNoball', !this.get('isNoball'));
    },
    shareBanner() {
      const id = this.get('model.id');
      const imageUrl = `http://localhost:8080/image/banner?id=${id}`;
    
      if (navigator.canShare && navigator.canShare({ files: [] })) {
        fetch(imageUrl)
          .then(response => response.blob())
          .then(blob => {
            const file = new File([blob], 'banner.jpg', { type: blob.type });
            return navigator.share({
              title: 'Match Banner',
              text: 'Check out this match banner!',
              files: [file]
            });
          })
          .catch(error => {
            console.error('Error sharing:', error);
            alert('Failed to share the banner.');
          });
      } else if (navigator.share) {
        navigator.share({
          title: 'Match Banner',
          text: 'Check out this match banner!',
          url: imageUrl
        })
          .catch(error => {
            console.error('Error sharing link:', error);
            alert('Failed to share the link.');
          });
      } else {
        navigator.clipboard.writeText(`Check out this match banner\n\n${imageUrl}`)
          .then(() => {
            alert('Sharing not supported — link copied to clipboard!');
          })
          .catch(error => {
            console.error('Error copying link:', error);
            alert(`You can manually share this link: ${imageUrl}`);
          });
      }
    },    
    downloadBanner() {
      let url = `http://localhost:8080/image/banner?id=${this.get('model.id')}`;
      let fileName = `match-banner-${this.get('model.id')}.jpg`;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to fetch file: ${response.statusText}`);
          }
          return response.blob();
        })
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.click();

          window.URL.revokeObjectURL(blobUrl);
        })
        .catch((error) => {
          console.error('Download failed:', error);
          alert('Failed to download the banner.');
        });
    },
  }
});

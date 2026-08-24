export const getMatchData = (match) => {
  const savedTimer = localStorage.getItem(`timer_${match._id}`);
  const savedScore = localStorage.getItem(`score_${match._id}`);
  const savedLivePlayers = localStorage.getItem(`livePlayers_${match._id}`);

  return {
    timer: savedTimer
      ? JSON.parse(savedTimer)
      : {
          elapsed: 0,
          running: false,
          extraTime: false,
          finished: false,
        },

    score: savedScore
      ? JSON.parse(savedScore)
      : {
          home: 0,
          away: 0,
        },

    livePlayers: savedLivePlayers
      ? JSON.parse(savedLivePlayers)
      : {
          home: match.homeStartingPlayers || [],
          away: match.awayStartingPlayers || [],
        },
  };
};

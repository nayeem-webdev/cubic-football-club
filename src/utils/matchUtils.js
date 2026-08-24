// =========================
// INITIAL STATES
// =========================

export const initialTimer = {
  elapsed: 0,
  running: false,
  extraTime: false,
  finished: false,
};

export const initialScore = {
  home: 0,
  away: 0,
};

export const initialLivePlayers = {
  home: [],
  away: [],
};

export const initialGoalData = {
  team: "",
  scorer: "",
  assister: "",
};

export const initialPenaltyData = {
  team: "",
  player: "",
};

export const initialCardData = {
  type: "",
  team: "",
  player: "",
};

export const initialSubstitutionData = {
  team: "",
  playerOut: "",
  playerIn: "",
};

// =========================
// SELECT MATCH
// =========================

export const handleSelectMatch = ({
  match,
  setSelectedMatch,
  setTimer,
  setScore,
  setLivePlayers,
}) => {
  // Load timer
  const savedTimer = localStorage.getItem(`timer_${match._id}`);

  // Load score
  const savedScore = localStorage.getItem(`score_${match._id}`);

  // Load live players
  const savedLivePlayers = localStorage.getItem(`livePlayers_${match._id}`);

  setSelectedMatch(match);

  setTimer(savedTimer ? JSON.parse(savedTimer) : initialTimer);

  setScore(savedScore ? JSON.parse(savedScore) : initialScore);

  setLivePlayers(
    savedLivePlayers
      ? JSON.parse(savedLivePlayers)
      : {
          home: match.homeStartingPlayers || [],
          away: match.awayStartingPlayers || [],
        },
  );
};

// =========================
// GOAL
// =========================

export const openGoalModal = ({
  timer,
  setGoalData,
  setGoalStep,
  setGoalModal,
}) => {
  if (timer.finished) return;

  setGoalData(initialGoalData);
  setGoalStep("team");
  setGoalModal(true);
};

export const closeGoalModal = ({ setGoalModal }) => {
  setGoalModal(false);
};

export const saveGoal = ({ goalData, setScore, setGoalModal }) => {
  if (!goalData.team) {
    alert("Please select a team");
    return;
  }

  if (!goalData.scorer) {
    alert("Please select who scored");
    return;
  }

  setScore((prev) => ({
    ...prev,
    [goalData.team]: prev[goalData.team] + 1,
  }));

  setGoalModal(false);
};

// =========================
// PENALTY
// =========================

export const openPenaltyModal = ({
  timer,
  setPenaltyData,
  setPenaltyModal,
}) => {
  if (timer.finished) return;

  setPenaltyData(initialPenaltyData);
  setPenaltyModal(true);
};

export const closePenaltyModal = ({ setPenaltyModal }) => {
  setPenaltyModal(false);
};

export const savePenalty = ({ penaltyData, setScore, setPenaltyModal }) => {
  if (!penaltyData.team) {
    alert("Please select a team");
    return;
  }

  if (!penaltyData.player) {
    alert("Please select the player");
    return;
  }

  setScore((prev) => ({
    ...prev,
    [penaltyData.team]: prev[penaltyData.team] + 1,
  }));

  setPenaltyModal(false);
};

// =========================
// CARDS
// =========================

export const openCardModal = ({ type, timer, setCardData, setCardModal }) => {
  if (timer.finished) return;

  setCardData({
    type,
    team: "",
    player: "",
  });

  setCardModal(true);
};

export const closeCardModal = ({ setCardModal }) => {
  setCardModal(false);
};

export const saveCard = ({ cardData, setCardModal }) => {
  if (!cardData.team) {
    alert("Please select a team");
    return;
  }

  if (!cardData.player) {
    alert("Please select a player");
    return;
  }

  setCardModal(false);
};

// =========================
// SUBSTITUTION
// =========================

export const closeSubstitutionModal = ({
  setSubstitutionModal,
  setSubstitutionData,
}) => {
  setSubstitutionModal(false);

  setSubstitutionData(initialSubstitutionData);
};

export const saveSubstitution = ({
  substitutionData,
  livePlayers,
  selectedMatch,
  setLivePlayers,
  setSubstitutionModal,
}) => {
  if (!substitutionData.team) {
    alert("Please select a team");
    return;
  }

  if (!substitutionData.playerOut) {
    alert("Please select the player coming OUT");
    return;
  }

  if (!substitutionData.playerIn) {
    alert("Please select the player coming IN");
    return;
  }

  const team = substitutionData.team;

  const playerOut = livePlayers[team].find(
    (player) => player._id === substitutionData.playerOut,
  );

  const substitutes =
    team === "home"
      ? selectedMatch.homeSubstitutes
      : selectedMatch.awaySubstitutes;

  const playerIn = substitutes.find(
    (player) => player._id === substitutionData.playerIn,
  );

  if (!playerOut || !playerIn) {
    alert("Invalid substitution");
    return;
  }

  setLivePlayers((prev) => ({
    ...prev,

    [team]: [
      ...prev[team].filter((player) => player._id !== playerOut._id),
      playerIn,
    ],
  }));

  setSubstitutionModal(false);
};

// =========================
// TIMER CONTROLS
// =========================

export const startTimer = ({ timer, setTimer }) => {
  if (timer.finished) return;

  setTimer((prev) => ({
    ...prev,
    running: true,
  }));
};

export const pauseTimer = ({ setTimer }) => {
  setTimer((prev) => ({
    ...prev,
    running: false,
  }));
};

export const startExtraTime = ({ setTimer }) => {
  setTimer((prev) => ({
    ...prev,
    extraTime: true,
    running: true,
  }));
};

// =========================
// FORMAT TIME
// =========================

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

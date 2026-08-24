import { useEffect, useState } from "react";

import {
  initialTimer,
  initialScore,
  initialLivePlayers,
  initialGoalData,
  initialPenaltyData,
  initialCardData,
  initialSubstitutionData,
  handleSelectMatch,
  openGoalModal,
  closeGoalModal,
  saveGoal,
  openPenaltyModal,
  closePenaltyModal,
  savePenalty,
  openCardModal,
  closeCardModal,
  saveCard,
  closeSubstitutionModal,
  saveSubstitution,
  startTimer,
  pauseTimer,
  startExtraTime,
  formatTime,
} from "../utils/matchUtils";

import Loader from "../components/Loader";
import GoalModal from "../components/GoalModal";
import PenaltyModal from "../components/PenaltyModal";
import CardModal from "../components/CardModal";
import SubstitutionModal from "../components/SubstitutionModal";
import SelectMatch from "../components/SelectMatch";

const API_URL = import.meta.env.VITE_API_URL;

export default function LiveMatch() {
  // =========================
  // MATCH STATE
  // =========================
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LIVE MATCH STATE
  // =========================

  const [timer, setTimer] = useState(initialTimer);
  const [score, setScore] = useState(initialScore);
  const [livePlayers, setLivePlayers] = useState(initialLivePlayers);

  // =========================
  // MODAL STATE
  // =========================

  const [goalModal, setGoalModal] = useState(false);
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [substitutionModal, setSubstitutionModal] = useState(false);

  // =========================
  // MODAL DATA
  // =========================

  const [goalData, setGoalData] = useState(initialGoalData);
  const [penaltyData, setPenaltyData] = useState(initialPenaltyData);
  const [cardData, setCardData] = useState(initialCardData);

  const [substitutionData, setSubstitutionData] = useState(
    initialSubstitutionData,
  );

  const [goalStep, setGoalStep] = useState("team");

  // =========================
  // FETCH MATCHES
  // =========================

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${API_URL}/matches`);
        const data = await response.json();

        setMatches(data.matches || []);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // =========================
  // SAVE MATCH DATA
  // =========================

  useEffect(() => {
    if (!selectedMatch) return;

    localStorage.setItem(`timer_${selectedMatch._id}`, JSON.stringify(timer));
  }, [timer, selectedMatch]);

  useEffect(() => {
    if (!selectedMatch) return;

    localStorage.setItem(`score_${selectedMatch._id}`, JSON.stringify(score));
  }, [score, selectedMatch]);

  useEffect(() => {
    if (!selectedMatch) return;

    localStorage.setItem(
      `livePlayers_${selectedMatch._id}`,
      JSON.stringify(livePlayers),
    );
  }, [livePlayers, selectedMatch]);

  // =========================
  // TIMER
  // =========================

  useEffect(() => {
    if (!timer.running || !selectedMatch) return;

    const normalTime = Number(selectedMatch.matchTime) * 60;
    const maximumTime = normalTime + 15 * 60;

    const interval = setInterval(() => {
      setTimer((previousTimer) => {
        const nextTime = previousTimer.elapsed + 1;

        // Normal match time finished
        if (!previousTimer.extraTime && nextTime >= normalTime) {
          return {
            ...previousTimer,
            elapsed: normalTime,
            running: false,
          };
        }

        // Extra time finished
        if (previousTimer.extraTime && nextTime >= maximumTime) {
          return {
            ...previousTimer,
            elapsed: maximumTime,
            running: false,
            finished: true,
          };
        }

        return {
          ...previousTimer,
          elapsed: nextTime,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer.running, selectedMatch]);

  // =========================
  // SELECT MATCH
  // =========================

  const selectMatch = (match) => {
    handleSelectMatch({
      match,
      setSelectedMatch,
      setTimer,
      setScore,
      setLivePlayers,
    });
  };

  // =========================
  // MATCH VALUES
  // =========================

  const normalTime = selectedMatch ? Number(selectedMatch.matchTime) * 60 : 0;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return <Loader />;
  }

  // =========================
  // SELECT MATCH
  // =========================

  if (!selectedMatch) {
    return <SelectMatch matches={matches} onSelectMatch={selectMatch} />;
  }

  // =========================
  // LIVE MATCH PAGE
  // =========================

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-6 text-[#F8FAFC]">
      <div className="mx-auto max-w-4xl">
        {/* CHANGE MATCH */}
        <button
          onClick={() => setSelectedMatch(null)}
          className="mb-6 flex items-center gap-2 rounded-xl border border-[#28466B] bg-[#0E1D34] px-4 py-2 text-sm font-medium text-[#B8C2D1] transition hover:border-[#3A82FF] hover:text-white"
        >
          ← Change Match
        </button>

        {/* MATCH HEADER */}
        <div className="overflow-hidden rounded-2xl border border-[#28466B] bg-[#0E1D34]">
          {/* MAIN SCORE AREA */}
          <div className="px-4 py-4 sm:px-6 sm:py-5">
            {/* TOP STATUS */}
            <div className="mb-3 flex items-center justify-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  timer.finished
                    ? "bg-red-500"
                    : timer.running
                      ? "animate-pulse bg-[#49C85A]"
                      : "bg-[#D4AF37]"
                }`}
              />

              <span
                className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                  timer.finished
                    ? "text-red-400"
                    : timer.running
                      ? "text-[#49C85A]"
                      : "text-[#D4AF37]"
                }`}
              >
                {timer.finished
                  ? "Match Finished"
                  : timer.extraTime
                    ? "Extra Time"
                    : timer.running
                      ? "Live"
                      : "Match Paused"}
              </span>
            </div>

            {/* SCOREBOARD */}
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
              {/* HOME TEAM */}
              <div className="flex items-center gap-3 sm:gap-5">
                {/* LOGO + NAME */}
                <div className="flex w-18 shrink-0 flex-col items-center sm:w-24">
                  <div className="flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20">
                    <img
                      src={selectedMatch.homeTeam.logoLow}
                      alt={selectedMatch.homeTeam.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <p className="mt-1.5 w-full truncate text-center text-[10px] font-medium text-[#B8C2D1] sm:text-xs">
                    {selectedMatch.homeTeam.name}
                  </p>
                </div>

                {/* SCORE */}
                <p className="text-5xl font-black leading-none tracking-tight text-[#F8FAFC] sm:text-8xl">
                  {score.home}
                </p>
              </div>

              {/* CENTER */}
              <div className="flex min-w-20 flex-col items-center px-1 sm:min-w-37.5">
                {/* MATCH TYPE */}
                <span className="mb-1 text-center text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] sm:text-xs">
                  {selectedMatch.matchType}
                </span>

                {/* TIMER */}
                <h1 className="whitespace-nowrap font-mono text-xl font-black leading-none text-[#F8FAFC] sm:text-4xl">
                  {formatTime(timer.elapsed)}
                </h1>

                {/* FORMAT */}
                <span className="mt-1 text-[9px] font-medium text-[#B8C2D1]/50 sm:text-[10px]">
                  {selectedMatch.playersPerTeam}v{selectedMatch.playersPerTeam}
                  <span className="mx-1 text-[#28466B]">•</span>
                  {selectedMatch.matchTime} MIN
                </span>
              </div>

              {/* AWAY TEAM */}
              <div className="flex items-center justify-end gap-3 sm:gap-5">
                {/* SCORE */}
                <p className="text-5xl font-black leading-none tracking-tight text-[#F8FAFC] sm:text-8xl">
                  {score.away}
                </p>

                {/* LOGO + NAME */}
                <div className="flex w-18 shrink-0 flex-col items-center sm:w-24">
                  <div className="flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20">
                    <img
                      src={selectedMatch.awayTeam.logoLow}
                      alt={selectedMatch.awayTeam.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <p className="mt-1.5 w-full truncate text-center text-[10px] font-medium text-[#B8C2D1] sm:text-xs">
                    {selectedMatch.awayTeam.name}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTROLS */}
            <div className="mt-4 flex justify-center gap-2">
              {!timer.running ? (
                <button
                  onClick={() =>
                    startTimer({
                      timer,
                      setTimer,
                    })
                  }
                  disabled={timer.finished}
                  className="rounded-lg bg-[#0E5FD8] px-5 py-2 text-xs font-bold transition hover:bg-[#3A82FF] hover:shadow-lg hover:shadow-[#0E5FD8]/20 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {timer.elapsed === 0 ? "▶ Start" : "▶ Resume"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    pauseTimer({
                      setTimer,
                    })
                  }
                  className="rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-xs font-bold text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
                >
                  ⏸ Pause
                </button>
              )}

              {!timer.extraTime &&
                timer.elapsed === normalTime &&
                !timer.finished && (
                  <button
                    onClick={() =>
                      startExtraTime({
                        setTimer,
                      })
                    }
                    className="rounded-lg border border-[#28466B] px-4 py-2 text-xs font-bold text-[#B8C2D1] transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
                  >
                    + Extra
                  </button>
                )}
            </div>
          </div>

          {/* MATCH DETAILS */}
          <div className="grid grid-cols-3 border-t border-[#28466B] divide-x divide-[#28466B]">
            {/* VENUE */}
            <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#B8C2D1]/40 sm:text-[9px]">
                Venue
              </p>

              <p className="mt-1 truncate text-[10px] font-semibold text-[#F8FAFC] sm:text-xs">
                {selectedMatch.matchSchedule?.venue}
              </p>
            </div>

            {/* DATE */}
            <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#B8C2D1]/40 sm:text-[9px]">
                Date
              </p>

              <p className="mt-1 truncate text-[10px] font-semibold text-[#F8FAFC] sm:text-xs">
                {selectedMatch.matchSchedule?.date}
              </p>
            </div>

            {/* TIME */}
            <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
              <p className="text-[8px] font-bold uppercase tracking-wider text-[#B8C2D1]/40 sm:text-[9px]">
                Time
              </p>

              <p className="mt-1 truncate text-[10px] font-semibold text-[#F8FAFC] sm:text-xs">
                {selectedMatch.matchSchedule?.time}
              </p>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-5 rounded-2xl border border-[#28466B] bg-[#0E1D34] p-3 sm:p-4">
          {/* HEADER */}
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold sm:text-base">Match Actions</h2>

            <span className="text-[10px] font-medium uppercase tracking-wider text-[#B8C2D1]/40">
              Quick Actions
            </span>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {/* GOAL */}
            <button
              onClick={() =>
                openGoalModal({
                  timer,
                  setGoalData,
                  setGoalStep,
                  setGoalModal,
                })
              }
              disabled={timer.finished}
              className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-[#3A82FF] transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
            >
              <span className="text-xl sm:text-2xl">⚽</span>

              <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                Goal
              </span>
            </button>

            {/* PENALTY */}
            <button
              onClick={() =>
                openPenaltyModal({
                  timer,
                  setPenaltyData,
                  setPenaltyModal,
                })
              }
              disabled={timer.finished}
              className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-[#3A82FF] transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
            >
              <span className="text-xl sm:text-2xl">🥅</span>

              <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                Penalty
              </span>
            </button>

            {/* YELLOW CARD */}
            <button
              onClick={() =>
                openCardModal({
                  type: "yellow",
                  timer,
                  setCardData,
                  setCardModal,
                })
              }
              disabled={timer.finished}
              className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-[#3A82FF] transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
            >
              <span className="text-xl sm:text-2xl">🟨</span>

              <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                Yellow
              </span>
            </button>

            {/* RED CARD */}
            <button
              onClick={() =>
                openCardModal({
                  type: "red",
                  timer,
                  setCardData,
                  setCardModal,
                })
              }
              disabled={timer.finished}
              className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-[#3A82FF] transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
            >
              <span className="text-xl sm:text-2xl">🟥</span>

              <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                Red
              </span>
            </button>

            {/* SUBSTITUTION */}
            <button
              onClick={() => setSubstitutionModal(true)}
              disabled={timer.finished}
              className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-[#3A82FF] transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
            >
              <span className="text-xl transition-transform duration-300 group-hover:rotate-180 sm:text-2xl">
                🔄
              </span>

              <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                Sub
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* GOAL MODAL */}
      {goalModal && (
        <GoalModal
          goalModal={goalModal}
          goalStep={goalStep}
          goalData={goalData}
          selectedMatch={selectedMatch}
          setGoalData={setGoalData}
          setGoalStep={setGoalStep}
          closeGoalModal={() =>
            closeGoalModal({
              setGoalModal,
            })
          }
          saveGoal={() =>
            saveGoal({
              goalData,
              setScore,
              setGoalModal,
            })
          }
        />
      )}

      {/* PENALTY MODAL */}
      {penaltyModal && (
        <PenaltyModal
          penaltyModal={penaltyModal}
          penaltyData={penaltyData}
          selectedMatch={selectedMatch}
          setPenaltyData={setPenaltyData}
          closePenaltyModal={() =>
            closePenaltyModal({
              setPenaltyModal,
            })
          }
          savePenalty={() =>
            savePenalty({
              penaltyData,
              setScore,
              setPenaltyModal,
            })
          }
        />
      )}

      {/* CARD MODAL */}
      {cardModal && (
        <CardModal
          cardModal={cardModal}
          cardData={cardData}
          selectedMatch={selectedMatch}
          setCardData={setCardData}
          closeCardModal={() =>
            closeCardModal({
              setCardModal,
            })
          }
          saveCard={() =>
            saveCard({
              cardData,
              setCardModal,
            })
          }
        />
      )}

      {/* SUBSTITUTION MODAL */}
      {substitutionModal && (
        <SubstitutionModal
          substitutionModal={substitutionModal}
          substitutionData={substitutionData}
          selectedMatch={selectedMatch}
          setSubstitutionData={setSubstitutionData}
          closeSubstitutionModal={() =>
            closeSubstitutionModal({
              setSubstitutionModal,
              setSubstitutionData,
            })
          }
          saveSubstitution={() =>
            saveSubstitution({
              substitutionData,
              livePlayers,
              selectedMatch,
              setLivePlayers,
              setSubstitutionModal,
            })
          }
        />
      )}
    </div>
  );
}

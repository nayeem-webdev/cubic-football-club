import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import SelectMatch from "../components/SelectMatch";
import ModalGoal from "../components/ModalGoal";
import ModalPenalty from "../components/ModalPenalty";
import ModalOwnGoal from "../components/ModalOwnGoal";
import ModalCard from "../components/ModalCard";
import ModalSubs from "../components/ModalSubs";
import MatchTimeline from "../components/MatchTimeline";
import MatchLineup from "../components/MatchLineup";

const API_URL = import.meta.env.VITE_API_URL;

export default function LiveScore() {
  //   TD  All Initial States
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("timeline");
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);

  //   TD Modal Step State
  const [goalStep, setGoalStep] = useState("team");
  const [penaltyStep, setPenaltyStep] = useState("team");
  const [ownGoalStep, setOwnGoalStep] = useState("team");
  const [cardStep, setCardStep] = useState("team");
  const [subsStep, setSubsStep] = useState("team");

  //   TD Modal Initial Data
  const [goalData, setGoalData] = useState({
    team: "",
    scorer: "",
    assister: "",
  });
  const [penaltyData, setPenaltyData] = useState({
    team: "",
    scorer: "",
  });
  const [ownGoalData, setOwnGoalData] = useState({
    team: "",
    scorer: "",
  });
  const [cardData, setCardData] = useState({
    team: "",
    card: "",
    player: "",
  });
  const [subsData, setSubsData] = useState({
    team: "",
    playerOut: "",
    playerIn: "",
  });

  //   TD Modal State
  const [goalModal, setGoalModal] = useState(false);
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [ownGoalModal, setOwnGoalModal] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [subsModal, setSubsModal] = useState(false);

  //   TD Modal Func
  const openGoalModal = () => {
    setGoalData({
      team: "",
      scorer: "",
      assister: "",
    });
    setGoalStep("team");
    setGoalModal(true);
  };

  const closeGoalModal = () => {
    setGoalModal(false);

    setGoalStep("team");

    setGoalData({
      team: "",
      scorer: "",
      assister: "",
    });
  };

  const openPenaltyModal = () => {
    setPenaltyData({
      team: "",
      scorer: "",
    });
    setPenaltyStep("team");

    setPenaltyModal(true);
  };

  const closePenaltyModal = () => {
    setPenaltyModal(false);

    setPenaltyStep("team");

    setPenaltyData({
      team: "",
      scorer: "",
    });
  };

  const openOwnGoalModal = () => {
    setOwnGoalData({
      team: "",
      scorer: "",
    });
    setOwnGoalStep("team");

    setOwnGoalModal(true);
  };

  const closeOwnGoalModal = () => {
    setOwnGoalModal(false);

    setOwnGoalStep("team");

    setOwnGoalData({
      team: "",
      scorer: "",
    });
  };

  const openCardModal = () => {
    setCardData({
      team: "",
      scorer: "",
    });
    setCardStep("team");

    setCardModal(true);
  };

  const closeCardModal = () => {
    setCardModal(false);

    setCardStep("team");

    setCardData({
      team: "",
      scorer: "",
    });
  };

  const openSubsModal = () => {
    setSubsData({
      team: "",
      playerOut: "",
      playerIn: "",
    });
    setSubsStep("team");

    setSubsModal(true);
  };

  const closeSubsModal = () => {
    setSubsModal(false);

    setSubsStep("team");

    setSubsData({
      team: "",
      playerOut: "",
      playerIn: "",
    });
  };

  //   $$ Event Func GOAL PENALTY OG CARD SUB
  //   TD Save Goal Event
  const saveGoal = () => {
    if (!goalData.team || !goalData.scorer) return;

    const newGoalEvent = {
      id: crypto.randomUUID(),
      type: "goal",
      team: goalData.team,
      scorer: goalData.scorer,
      assister: goalData.assister,
      time: currentElapsed,
      createdAt: new Date().toISOString(),
    };

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        matchEvents: [...(previous.matchEvents || []), newGoalEvent],
      };
    });

    closeGoalModal();
  };

  //   TD Save Penalty Event
  const savePenalty = () => {
    if (!penaltyData.team || !penaltyData.scorer) return;

    const newPenaltyEvent = {
      id: crypto.randomUUID(),
      type: "penalty",
      team: penaltyData.team,
      scorer: penaltyData.scorer,
      time: currentElapsed,
      createdAt: new Date().toISOString(),
    };

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        matchEvents: [...(previous.matchEvents || []), newPenaltyEvent],
      };
    });

    closePenaltyModal();
  };

  //   TD Save Own Goal Event
  const saveOwnGoal = () => {
    if (!ownGoalData.team || !ownGoalData.scorer) return;

    const newOwnGoalEvent = {
      id: crypto.randomUUID(),
      type: "ownGoal",
      team: ownGoalData.team,
      scorer: ownGoalData.scorer,
      time: currentElapsed,
      createdAt: new Date().toISOString(),
    };

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        matchEvents: [...(previous.matchEvents || []), newOwnGoalEvent],
      };
    });

    closeOwnGoalModal();
  };

  //   TD Save Card Event

  const saveCard = () => {
    if (!cardData.team || !cardData.card || !cardData.player) return;

    const newCardEvent = {
      id: crypto.randomUUID(),
      type: "card",
      team: cardData.team,
      player: cardData.player,
      card: cardData.card,
      time: currentElapsed,
      createdAt: new Date().toISOString(),
    };

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        matchEvents: [...(previous.matchEvents || []), newCardEvent],
      };
    });

    closeCardModal();
  };

  //   TD Save Subs Event

  const saveSubs = () => {
    if (!subsData.team || !subsData.playerOut || !subsData.playerIn) {
      return;
    }

    const newSubstitutionEvent = {
      id: crypto.randomUUID(),
      type: "substitution",
      team: subsData.team,
      playerOut: subsData.playerOut,
      playerIn: subsData.playerIn,
      time: currentElapsed,
      createdAt: new Date().toISOString(),
    };

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        matchEvents: [...(previous.matchEvents || []), newSubstitutionEvent],
      };
    });

    closeSubsModal();
  };

  //   $$  Lets Fetch Match for Selection
  //   TD Data Fetched
  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await fetch(`${API_URL}/matches`);
        if (!response.ok) {
          throw new Error("Failed to fetch matches");
        }

        const data = await response.json();

        setMatches(data.matches || []);
      } catch (error) {
        console.error("Failed to fetch matches:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchMatches();
  }, []);

  //   $$ Lets Select a Match
  //   TD Handle Select Match
  const selectMatch = (match) => {
    //* Check if saved match already exists
    const savedMatch = localStorage.getItem(`liveMatch_${match._id}`);
    //* Load existing match
    if (savedMatch) {
      try {
        const liveMatch = JSON.parse(savedMatch);
        setSelectedMatch(liveMatch);
        return;
      } catch (error) {
        console.error("Failed to load saved match:", error);
        localStorage.removeItem(`liveMatch_${match._id}`);
      }
    }

    //* Create new live match
    const liveMatch = {
      ...match,
      timer: {
        elapsed: 0,
        running: false,
        extraTime: false,
        finished: false,
        startedAt: null,
      },
      matchEvents: [],
    };
    setSelectedMatch(liveMatch);
    localStorage.setItem(`liveMatch_${match._id}`, JSON.stringify(liveMatch));
  };

  //   $$ Timer
  //   TD Load Timer form LS or Start a New Timer
  useEffect(() => {
    if (!selectedMatch?.timer.running) return;
    if (selectedMatch?.timer.finished) return;

    const interval = setInterval(() => {
      const now = Date.now();

      setCurrentTime(now);

      setSelectedMatch((previous) => {
        if (!previous || !previous.timer.running) {
          return previous;
        }

        const startedAt = previous.timer.startedAt;

        if (!startedAt) {
          return previous;
        }

        const matchTime = Number(previous.matchTime);
        const normalTime = matchTime * 60;
        const maximumTime = normalTime + 15 * 60;

        const passedSeconds = Math.floor((now - startedAt) / 1000);

        const actualElapsed = previous.timer.elapsed + passedSeconds;

        // Match finished
        if (actualElapsed >= maximumTime) {
          return {
            ...previous,
            timer: {
              ...previous.timer,
              elapsed: maximumTime,
              running: false,
              extraTime: true,
              finished: true,
              startedAt: null,
            },
          };
        }

        // Extra time
        const extraTime = actualElapsed >= normalTime;

        return {
          ...previous,
          timer: {
            ...previous.timer,
            extraTime,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedMatch?.timer.running, selectedMatch?.timer.finished]);

  //   TD Calculate actual current elapsed
  const currentElapsed = (() => {
    if (!selectedMatch) return 0;

    const { timer } = selectedMatch;

    // Paused or finished
    if (!timer.running || !timer.startedAt) {
      return timer.elapsed;
    }

    const passedSeconds = Math.floor((currentTime - timer.startedAt) / 1000);

    return timer.elapsed + passedSeconds;
  })();

  //   TD Check Maximum Match Time
  useEffect(() => {
    if (!selectedMatch?.timer.running) return;
    if (selectedMatch.timer.finished) return;

    const interval = setInterval(() => {
      const now = Date.now();

      const matchTime = Number(selectedMatch.matchTime);
      const normalTime = matchTime * 60;
      const maximumTime = normalTime + 15 * 60;

      const passedSeconds = Math.floor(
        (now - selectedMatch.timer.startedAt) / 1000,
      );

      const actualElapsed = selectedMatch.timer.elapsed + passedSeconds;

      // Maximum time reached
      if (actualElapsed >= maximumTime) {
        setSelectedMatch((previous) => {
          if (!previous || previous.timer.finished) {
            return previous;
          }

          return {
            ...previous,
            timer: {
              ...previous.timer,
              elapsed: maximumTime,
              running: false,
              extraTime: true,
              finished: true,
              startedAt: null,
            },
          };
        });

        return;
      }

      // Extra time starts
      if (actualElapsed >= normalTime) {
        setSelectedMatch((previous) => {
          if (!previous) return previous;

          return {
            ...previous,
            timer: {
              ...previous.timer,
              extraTime: true,
            },
          };
        });
      }

      setCurrentTime(now);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedMatch?.timer.running,
    selectedMatch?.timer.finished,
    selectedMatch?.matchTime,
  ]);

  //   TD Timer Start Func
  const startTimer = () => {
    const now = Date.now();

    setCurrentTime(now);

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      if (previous.timer.finished) {
        return previous;
      }

      if (previous.timer.running) {
        return previous;
      }

      return {
        ...previous,
        timer: {
          ...previous.timer,
          running: true,
          startedAt: now,
        },
      };
    });
  };

  //   TD Timer Pause Func
  const pauseTimer = () => {
    const now = Date.now();

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      if (previous.timer.finished) {
        return previous;
      }

      if (!previous.timer.running) {
        return previous;
      }

      let actualElapsed = previous.timer.elapsed;

      if (previous.timer.startedAt) {
        actualElapsed += Math.floor((now - previous.timer.startedAt) / 1000);
      }

      return {
        ...previous,
        timer: {
          ...previous.timer,
          elapsed: actualElapsed,
          running: false,
          startedAt: null,
        },
      };
    });
  };

  //   TD Timer End or Match End Func
  const endMatch = () => {
    setSelectedMatch((previous) => {
      if (!previous) return previous;

      let finalElapsed = previous.timer.elapsed;

      if (previous.timer.running && previous.timer.startedAt) {
        finalElapsed += Math.floor(
          (Date.now() - previous.timer.startedAt) / 1000,
        );
      }

      const matchTime = Number(previous.matchTime);
      const normalTime = matchTime * 60;

      return {
        ...previous,
        timer: {
          ...previous.timer,
          elapsed: finalElapsed,
          running: false,
          finished: true,
          extraTime: finalElapsed >= normalTime,
          startedAt: null,
        },
      };
    });
  };

  //   TD Cancel Match Func
  const cancelMatch = () => {
    if (!selectedMatch) return;

    localStorage.removeItem(`liveMatch_${selectedMatch._id}`);

    setSelectedMatch(null);
  };

  //   TD Format Time Func for Display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  //   $$ Save Match To LS
  useEffect(() => {
    if (!selectedMatch) return;

    localStorage.setItem(
      `liveMatch_${selectedMatch._id}`,
      JSON.stringify(selectedMatch),
    );
  }, [selectedMatch]);

  //   $$ Calculate Match Score
  const calculateScore = (events) => {
    let home = 0;
    let away = 0;

    events.forEach((event) => {
      if (event.type === "goal") {
        if (event.team === "home") home++;
        if (event.team === "away") away++;
      }

      if (event.type === "ownGoal") {
        if (event.team === "home") away++;
        if (event.team === "away") home++;
      }

      if (event.type === "penalty") {
        if (event.team === "home") home++;
        if (event.team === "away") away++;
      }
    });

    return { home, away };
  };

  // TD Call calculateScore
  const score = selectedMatch
    ? calculateScore(selectedMatch.matchEvents)
    : { home: 0, away: 0 };

  // TD Save Score in DB
  const saveMatch = async () => {
    if (!selectedMatch || !selectedMatch.timer.finished) return;
    setPageLoading(true);
    const payload = {
      match: selectedMatch._id,

      homeTeam: selectedMatch.homeTeam._id,
      awayTeam: selectedMatch.awayTeam._id,

      homeScore: score.home,
      awayScore: score.away,

      timer: {
        elapsed: selectedMatch.timer.elapsed,
        extraTime: selectedMatch.timer.extraTime,
        finished: selectedMatch.timer.finished,
      },

      matchEvents: selectedMatch.matchEvents || [],
    };

    try {
      const response = await fetch(`${API_URL}/scores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save match");
      }

      // Remove live match from localStorage
      localStorage.removeItem(`liveMatch_${selectedMatch._id}`);

      // Return to match selection
      setSelectedMatch(null);

      console.log("Match saved:", data);
      setPageLoading(false);
    } catch (error) {
      console.error("Failed to save match:", error);
      alert("Failed to save match. Please try again.");
    }
  };

  //## =========================
  //## FAKE DATA
  //## =========================

  //   ** Show Loader Till Data Fetch

  if (pageLoading) {
    return <Loader />;
  }

  //   ** Select Match Page

  if (!selectedMatch) {
    return <SelectMatch matches={matches} onSelectMatch={selectMatch} />;
  }

  //   ** Score Board Page

  return (
    <>
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
                    selectedMatch.timer.finished
                      ? "bg-red-500"
                      : selectedMatch.timer.running
                        ? "animate-pulse bg-[#49C85A]"
                        : "bg-[#D4AF37]"
                  }`}
                />

                <span
                  className={`text-[10px] font-bold uppercase tracking-[0.18em] ${
                    selectedMatch.timer.finished
                      ? "text-red-400"
                      : selectedMatch.timer.running
                        ? "text-[#49C85A]"
                        : "text-[#D4AF37]"
                  }`}
                >
                  {selectedMatch.timer.finished
                    ? "Match Finished"
                    : selectedMatch.timer.extraTime
                      ? "Extra Time"
                      : selectedMatch.timer.running
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
                  <h2 className="text-5xl font-semibold leading-none tracking-tight text-[#F8FAFC] sm:text-8xl">
                    {score.home}
                  </h2>
                </div>

                {/* CENTER */}
                <div className="flex min-w-20 flex-col items-center px-1 sm:min-w-37.5">
                  {/* MATCH TYPE */}
                  <span className="mb-1 text-center text-[9px] font-bold uppercase tracking-wider text-[#D4AF37] sm:text-xs">
                    {selectedMatch.matchType}
                  </span>

                  {/* TIMER */}
                  <p className="whitespace-nowrap tracking-wider text-xl font-black leading-none text-[#F8FAFC] sm:text-4xl">
                    {formatTime(currentElapsed)}
                  </p>

                  {/* FORMAT */}
                  <span className="mt-1 text-[9px] font-medium text-[#B8C2D1]/50 sm:text-[10px]">
                    {selectedMatch.playersPerTeam}v
                    {selectedMatch.playersPerTeam}
                    <span className="mx-1 text-[#28466B]">•</span>
                    {selectedMatch.matchTime} MIN
                  </span>
                </div>

                {/* AWAY TEAM */}
                <div className="flex items-center justify-end gap-3 sm:gap-5">
                  {/* SCORE */}
                  <h2 className="text-5xl font-semibold leading-none tracking-tight text-[#F8FAFC] sm:text-8xl">
                    {score.away}
                  </h2>

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
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {!selectedMatch.timer.finished && (
                  <>
                    {!selectedMatch.timer.finished && (
                      <>
                        {!selectedMatch.timer.running ? (
                          <button
                            type="button"
                            onClick={startTimer}
                            className="rounded-lg bg-[#0E5FD8] px-5 py-2 text-xs font-bold transition hover:bg-[#3A82FF] hover:shadow-lg hover:shadow-[#0E5FD8]/20"
                          >
                            {selectedMatch.timer.elapsed === 0
                              ? "▶ Start"
                              : "▶ Resume"}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={pauseTimer}
                            className="rounded-lg border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-5 py-2 text-xs font-bold text-[#D4AF37] transition hover:bg-[#D4AF37]/20"
                          >
                            ⏸ Pause
                          </button>
                        )}
                      </>
                    )}

                    <button
                      onClick={endMatch}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                    >
                      🏁 End Match
                    </button>
                  </>
                )}

                {/* AFTER MATCH ENDED */}

                {selectedMatch.timer.finished && (
                  <>
                    <button
                      onClick={cancelMatch}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/20"
                    >
                      ✕ Cancel Match
                    </button>

                    <button
                      onClick={saveMatch}
                      className="rounded-lg bg-[#49C85A] px-5 py-2 text-xs font-bold text-[#07111F] transition hover:bg-[#49C85A]/90 hover:shadow-lg hover:shadow-[#49C85A]/20"
                    >
                      ✓ Save Match
                    </button>
                  </>
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
                  {selectedMatch.matchSchedule.venue.venue}
                </p>
              </div>

              {/* DATE */}
              <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#B8C2D1]/40 sm:text-[9px]">
                  Date
                </p>

                <p className="mt-1 truncate text-[10px] font-semibold text-[#F8FAFC] sm:text-xs">
                  {new Date(
                    selectedMatch.matchSchedule.date,
                  ).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* TIME */}
              <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
                <p className="text-[8px] font-bold uppercase tracking-wider text-[#B8C2D1]/40 sm:text-[9px]">
                  Time
                </p>

                <p className="mt-1 truncate text-[10px] font-semibold text-[#F8FAFC] sm:text-xs">
                  {selectedMatch.matchSchedule.time}
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
                onClick={openGoalModal}
                disabled={
                  !selectedMatch.timer.running || selectedMatch.timer.finished
                }
                className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
              >
                <span className="text-xl sm:text-2xl">⚽</span>

                <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                  Goal
                </span>
              </button>

              {/* PENALTY */}
              <button
                onClick={openPenaltyModal}
                disabled={
                  !selectedMatch.timer.running || selectedMatch.timer.finished
                }
                className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
              >
                <span className="text-xl sm:text-2xl">🥅</span>

                <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                  Penalty
                </span>
              </button>

              {/* OWN GOAL */}
              <button
                onClick={openOwnGoalModal}
                disabled={
                  !selectedMatch.timer.running || selectedMatch.timer.finished
                }
                className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
              >
                <span className="text-xl sm:text-2xl">🏐</span>

                <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                  Own Goal
                </span>
              </button>

              {/* YELLOW CARD */}
              <button
                onClick={openCardModal}
                disabled={
                  !selectedMatch.timer.running || selectedMatch.timer.finished
                }
                className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
              >
                <span className="text-xl sm:text-2xl">📕</span>

                <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                  Cards
                </span>
              </button>

              {/* SUBSTITUTION */}
              <button
                onClick={openSubsModal}
                disabled={
                  !selectedMatch.timer.running || selectedMatch.timer.finished
                }
                className="group flex flex-col items-center justify-center rounded-xl border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 px-2 py-3 text-white transition hover:-translate-y-0.5 hover:bg-[#0E5FD8]/20 hover:shadow-lg hover:shadow-[#0E5FD8]/10 disabled:cursor-not-allowed disabled:opacity-40 sm:py-4"
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

          {/* MATCH INFO TABS */}

          <div className="mt-5 rounded-2xl border border-[#28466B] bg-[#0E1D34] p-1.5">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "timeline"
                    ? "bg-[#0E5FD8]/20 text-[#F8FAFC]"
                    : "text-[#B8C2D1] hover:bg-[#07111F] hover:text-[#F8FAFC]"
                }`}
              >
                Timeline
              </button>

              <button
                onClick={() => setActiveTab("lineup")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "lineup"
                    ? "bg-[#0E5FD8]/20 text-[#F8FAFC]"
                    : "text-[#B8C2D1] hover:bg-[#07111F] hover:text-[#F8FAFC]"
                }`}
              >
                Lineup
              </button>
            </div>
          </div>
          {/* TIMELINE */}
          {activeTab === "timeline" && (
            <MatchTimeline selectedMatch={selectedMatch} />
          )}

          {activeTab === "lineup" && (
            <MatchLineup selectedMatch={selectedMatch} />
          )}
        </div>
      </div>
      <ModalGoal
        goalModal={goalModal}
        goalStep={goalStep}
        goalData={goalData}
        selectedMatch={selectedMatch}
        setGoalData={setGoalData}
        setGoalStep={setGoalStep}
        closeGoalModal={closeGoalModal}
        saveGoal={saveGoal}
      />
      <ModalPenalty
        penaltyModal={penaltyModal}
        penaltyStep={penaltyStep}
        penaltyData={penaltyData}
        selectedMatch={selectedMatch}
        setPenaltyData={setPenaltyData}
        setPenaltyStep={setPenaltyStep}
        closePenaltyModal={closePenaltyModal}
        savePenalty={savePenalty}
      />
      <ModalOwnGoal
        ownGoalModal={ownGoalModal}
        ownGoalStep={ownGoalStep}
        ownGoalData={ownGoalData}
        selectedMatch={selectedMatch}
        setOwnGoalData={setOwnGoalData}
        setOwnGoalStep={setOwnGoalStep}
        closeOwnGoalModal={closeOwnGoalModal}
        saveOwnGoal={saveOwnGoal}
      />
      <ModalCard
        cardModal={cardModal}
        cardStep={cardStep}
        cardData={cardData}
        selectedMatch={selectedMatch}
        setCardData={setCardData}
        setCardStep={setCardStep}
        closeCardModal={closeCardModal}
        saveCard={saveCard}
      />
      <ModalSubs
        subsModal={subsModal}
        subsStep={subsStep}
        subsData={subsData}
        selectedMatch={selectedMatch}
        setSubsData={setSubsData}
        setSubsStep={setSubsStep}
        closeSubsModal={closeSubsModal}
        saveSubs={saveSubs}
      />
    </>
  );
}

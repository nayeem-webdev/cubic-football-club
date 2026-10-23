import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, Clock, Save, RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

import ModalGoal from "../components/ModalGoal";
import ModalPenalty from "../components/ModalPenalty";
import ModalOwnGoal from "../components/ModalOwnGoal";
import ModalCard from "../components/ModalCard";
import ModalEdit from "../components/ModalEdit";
import ModalSubs from "../components/ModalSubs";

import MatchTimeline from "../components/MatchTimeline";
import MatchLineup from "../components/MatchLineup";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditScore() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ==========================================
  // INITIAL STATE
  // ==========================================

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedMatch, setSelectedMatch] = useState(null);

  const [activeTab, setActiveTab] = useState("timeline");

  // ==========================================
  // TIMER EDIT STATE
  // ==========================================

  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerExtraTime, setTimerExtraTime] = useState(false);

  // ==========================================
  // MODAL STEP STATES
  // ==========================================

  const [goalStep, setGoalStep] = useState("team");
  const [penaltyStep, setPenaltyStep] = useState("team");
  const [ownGoalStep, setOwnGoalStep] = useState("team");
  const [cardStep, setCardStep] = useState("team");
  const [subsStep, setSubsStep] = useState("team");

  // ==========================================
  // MODAL DATA
  // ==========================================

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

  // ==========================================
  // MODAL OPEN/CLOSE STATES
  // ==========================================

  const [goalModal, setGoalModal] = useState(false);
  const [penaltyModal, setPenaltyModal] = useState(false);
  const [ownGoalModal, setOwnGoalModal] = useState(false);
  const [cardModal, setCardModal] = useState(false);
  const [subsModal, setSubsModal] = useState(false);
  const [editEventsModal, setEditEventsModal] = useState(false);

  // ==========================================
  // FETCH SAVED SCORE
  // ==========================================

  useEffect(() => {
    const fetchScore = async () => {
      try {
        setPageLoading(true);

        if (!id) {
          throw new Error("Score ID is missing");
        }

        const response = await fetch(`${API_URL}/scores/${id}`);

        const contentType = response.headers.get("content-type");

        if (!response.ok) {
          const text = await response.text();

          console.error("Server response:", text);

          throw new Error(`Failed to fetch score (${response.status})`);
        }

        if (!contentType?.includes("application/json")) {
          const text = await response.text();

          console.error("Expected JSON but received:", text);

          throw new Error("The score endpoint returned HTML instead of JSON.");
        }

        const data = await response.json();

        const savedScore = data.score || data;

        if (!savedScore) {
          throw new Error("Score data not found");
        }

        const matchData = savedScore.match || {};

        const match = {
          ...matchData,

          _id: matchData._id || savedScore.match?._id || savedScore.match,

          homeTeam: savedScore.homeTeam || matchData.homeTeam || null,

          awayTeam: savedScore.awayTeam || matchData.awayTeam || null,

          matchSchedule:
            savedScore.matchSchedule ||
            matchData.matchSchedule ||
            matchData.schedule ||
            null,

          matchTime:
            savedScore.matchTime ||
            matchData.matchTime ||
            matchData.schedule?.matchTime ||
            0,

          homeStartingPlayers:
            savedScore.homeStartingPlayers ||
            matchData.homeStartingPlayers ||
            [],

          homeSubstitutes:
            savedScore.homeSubstitutes || matchData.homeSubstitutes || [],

          awayStartingPlayers:
            savedScore.awayStartingPlayers ||
            matchData.awayStartingPlayers ||
            [],

          awaySubstitutes:
            savedScore.awaySubstitutes || matchData.awaySubstitutes || [],

          matchEvents: savedScore.matchEvents || [],

          timer: {
            elapsed: Number(savedScore.timer?.elapsed || 0),
            running: false,
            extraTime: Boolean(savedScore.timer?.extraTime),
            finished: true,
            startedAt: null,
          },

          scoreId: savedScore._id,
        };

        setSelectedMatch(match);

        // ==========================================
        // LOAD TIMER INTO EDIT FIELDS
        // ==========================================

        const elapsed = Number(savedScore.timer?.elapsed || 0);

        setTimerMinutes(Math.floor(elapsed / 60));
        setTimerSeconds(elapsed % 60);
        setTimerExtraTime(Boolean(savedScore.timer?.extraTime));
      } catch (error) {
        console.error("Failed to fetch score:", error);
        alert(error.message || "Failed to load score.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchScore();
  }, [id]);

  // ==========================================
  // CURRENT ELAPSED TIME
  // ==========================================

  const currentElapsed = selectedMatch?.timer?.elapsed || 0;

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (seconds) => {
    const safeSeconds = Math.max(0, Number(seconds) || 0);

    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds,
    ).padStart(2, "0")}`;
  };

  // ==========================================
  // CALCULATE SCORE FROM EVENTS
  // ==========================================

  const calculateScore = (events = []) => {
    let home = 0;
    let away = 0;

    events.forEach((event) => {
      if (!event) return;

      // Normal goal
      if (event.type === "goal") {
        if (event.team === "home") {
          home += 1;
        }

        if (event.team === "away") {
          away += 1;
        }
      }

      // Penalty
      if (event.type === "penalty") {
        if (event.team === "home") {
          home += 1;
        }

        if (event.team === "away") {
          away += 1;
        }
      }

      // Own goal
      //
      // If home player scores own goal,
      // away gets the goal.
      //
      // If away player scores own goal,
      // home gets the goal.

      if (event.type === "ownGoal") {
        if (event.team === "home") {
          away += 1;
        }

        if (event.team === "away") {
          home += 1;
        }
      }
    });

    return {
      home,
      away,
    };
  };

  // ==========================================
  // AUTOMATIC SCORE
  // ==========================================

  const score = useMemo(() => {
    if (!selectedMatch) {
      return {
        home: 0,
        away: 0,
      };
    }

    return calculateScore(selectedMatch.matchEvents || []);
  }, [selectedMatch]);

  // ==========================================
  // OPEN GOAL MODAL
  // ==========================================

  const openGoalModal = () => {
    setGoalData({
      team: "",
      scorer: "",
      assister: "",
    });

    setGoalStep("team");
    setGoalModal(true);
  };

  // ==========================================
  // CLOSE GOAL MODAL
  // ==========================================

  const closeGoalModal = () => {
    setGoalModal(false);

    setGoalStep("team");

    setGoalData({
      team: "",
      scorer: "",
      assister: "",
    });
  };

  // ==========================================
  // OPEN PENALTY MODAL
  // ==========================================

  const openPenaltyModal = () => {
    setPenaltyData({
      team: "",
      scorer: "",
    });

    setPenaltyStep("team");
    setPenaltyModal(true);
  };

  // ==========================================
  // CLOSE PENALTY MODAL
  // ==========================================

  const closePenaltyModal = () => {
    setPenaltyModal(false);

    setPenaltyStep("team");

    setPenaltyData({
      team: "",
      scorer: "",
    });
  };

  // ==========================================
  // OPEN OWN GOAL MODAL
  // ==========================================

  const openOwnGoalModal = () => {
    setOwnGoalData({
      team: "",
      scorer: "",
    });

    setOwnGoalStep("team");
    setOwnGoalModal(true);
  };

  // ==========================================
  // CLOSE OWN GOAL MODAL
  // ==========================================

  const closeOwnGoalModal = () => {
    setOwnGoalModal(false);

    setOwnGoalStep("team");

    setOwnGoalData({
      team: "",
      scorer: "",
    });
  };

  // ==========================================
  // OPEN CARD MODAL
  // ==========================================

  const openCardModal = () => {
    setCardData({
      team: "",
      card: "",
      player: "",
    });

    setCardStep("team");
    setCardModal(true);
  };

  // ==========================================
  // CLOSE CARD MODAL
  // ==========================================

  const closeCardModal = () => {
    setCardModal(false);

    setCardStep("team");

    setCardData({
      team: "",
      card: "",
      player: "",
    });
  };

  // ==========================================
  // OPEN SUB MODAL
  // ==========================================

  const openSubsModal = () => {
    setSubsData({
      team: "",
      playerOut: "",
      playerIn: "",
    });

    setSubsStep("team");
    setSubsModal(true);
  };

  // ==========================================
  // CLOSE SUB MODAL
  // ==========================================

  const closeSubsModal = () => {
    setSubsModal(false);

    setSubsStep("team");

    setSubsData({
      team: "",
      playerOut: "",
      playerIn: "",
    });
  };

  // ==========================================
  // SAVE GOAL EVENT
  // ==========================================

  const saveGoal = () => {
    if (!goalData.team || !goalData.scorer) {
      return;
    }

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

  // ==========================================
  // SAVE PENALTY EVENT
  // ==========================================

  const savePenalty = () => {
    if (!penaltyData.team || !penaltyData.scorer) {
      return;
    }

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

  // ==========================================
  // SAVE OWN GOAL EVENT
  // ==========================================

  const saveOwnGoal = () => {
    if (!ownGoalData.team || !ownGoalData.scorer) {
      return;
    }

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

  // ==========================================
  // SAVE CARD EVENT
  // ==========================================

  const saveCard = () => {
    if (!cardData.team || !cardData.card || !cardData.player) {
      return;
    }

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

  // ==========================================
  // SAVE SUBSTITUTION EVENT
  // ==========================================

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

  // ==========================================
  // DELETE EVENT
  // ==========================================

  const deleteMatchEvent = (eventId) => {
    setSelectedMatch((previousMatch) => {
      if (!previousMatch) return previousMatch;

      return {
        ...previousMatch,

        matchEvents: (previousMatch.matchEvents || []).filter(
          (event) => event.id !== eventId,
        ),
      };
    });
  };

  // ==========================================
  // UPDATE EVENT
  // ==========================================

  const updateMatchEvent = (updatedEvent) => {
    setSelectedMatch((previousMatch) => {
      if (!previousMatch) return previousMatch;

      return {
        ...previousMatch,

        matchEvents: (previousMatch.matchEvents || []).map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event,
        ),
      };
    });
  };

  // ==========================================
  // UPDATE TIMER
  // ==========================================

  const updateTimer = () => {
    const minutes = Math.max(0, Number(timerMinutes) || 0);

    const seconds = Math.min(59, Math.max(0, Number(timerSeconds) || 0));

    const elapsed = minutes * 60 + seconds;

    setSelectedMatch((previous) => {
      if (!previous) return previous;

      return {
        ...previous,

        timer: {
          ...previous.timer,
          elapsed,
          extraTime: timerExtraTime,
          running: false,
          finished: true,
          startedAt: null,
        },
      };
    });

    setTimerMinutes(minutes);
    setTimerSeconds(seconds);
  };

  // ==========================================
  // RESET TIMER INPUT FROM SAVED VALUE
  // ==========================================

  const resetTimerInput = () => {
    if (!selectedMatch) return;

    const elapsed = selectedMatch.timer?.elapsed || 0;

    setTimerMinutes(Math.floor(elapsed / 60));

    setTimerSeconds(elapsed % 60);

    setTimerExtraTime(Boolean(selectedMatch.timer?.extraTime));
  };

  // ==========================================
  // SAVE UPDATED SCORE
  // ==========================================

  const saveScore = async () => {
    if (!selectedMatch) return;

    try {
      setSaving(true);

      /*
       * ALWAYS calculate score from events.
       *
       * Never trust manually entered score values.
       */

      const finalScore = calculateScore(selectedMatch.matchEvents || []);

      const payload = {
        homeScore: finalScore.home,
        awayScore: finalScore.away,

        timer: {
          elapsed: selectedMatch.timer.elapsed,
          extraTime: selectedMatch.timer.extraTime,
          finished: true,
        },

        matchEvents: selectedMatch.matchEvents || [],
      };

      const response = await fetch(`${API_URL}/scores/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update score");
      }

      alert("Score updated successfully.");

      /*
       * Go back after successful update.
       */

      navigate(-1);
    } catch (error) {
      console.error("Failed to update score:", error);

      alert(error.message || "Failed to update score.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // MATCH NOT FOUND
  // ==========================================

  if (!selectedMatch) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 text-text">
        <div className="mx-auto max-w-4xl">
          <PageHero
            text="CUBIC FC"
            heading="Edit Score"
            subheading="Unable to load this match score."
          />

          {pageLoading && <Loader />}
        </div>
      </div>
    );
  }

  // ==========================================
  // SAFE MATCH SCHEDULE
  // ==========================================

  const schedule = selectedMatch.matchSchedule || {};

  const venue = schedule.venue?.venue || schedule.venue || "Unknown Venue";

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <>
      <div className="min-h-screen bg-background px-4 py-6 text-text">
        {saving && <Loader />}
        {pageLoading && <Loader />}

        <div className="mx-auto max-w-4xl">
          {/* ======================================
              HEADER
          ====================================== */}

          <PageHero
            text="CUBIC FC"
            heading="Edit Score"
            subheading="Update Goals, Events, Timer and Match Details."
          />

          {/* ======================================
              BACK BUTTON
          ====================================== */}

          <button
            onClick={() => navigate(-1)}
            className="mb-5 flex items-center gap-2 rounded-xl bg-card px-4 py-2 text-sm font-medium text-text-muted transition hover:text-text"
          >
            <ChevronLeft size={17} />
            Back
          </button>

          {/* ======================================
              MATCH SCORE CARD
          ====================================== */}

          <div className="overflow-hidden rounded-2xl bg-card text-text-muted">
            {/* SCORE AREA */}

            <div className="px-4 py-5 sm:px-6 sm:py-6">
              {/* STATUS */}

              <div className="mb-2 flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />

                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                  Editing Saved Match
                </span>
              </div>

              {/* SCOREBOARD */}

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">
                {/* HOME */}

                <div className="flex items-center gap-3 sm:gap-5">
                  <div className="flex w-18 shrink-0 flex-col items-center sm:w-24">
                    <div className="flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20">
                      {selectedMatch.homeTeam?.logoLow && (
                        <img
                          src={selectedMatch.homeTeam.logoLow}
                          alt={selectedMatch.homeTeam.name}
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>

                    <p className="mt-1.5 w-full truncate text-center text-[10px] font-medium text-text-muted sm:text-xs">
                      {selectedMatch.homeTeam?.name || "Home Team"}
                    </p>
                  </div>

                  <h2 className="text-5xl font-semibold leading-none tracking-tight text-text sm:text-8xl">
                    {score.home}
                  </h2>
                </div>

                {/* CENTER */}

                <div className="flex min-w-20 flex-col items-center px-1 sm:min-w-37.5">
                  <span className="mb-1 text-center text-[9px] font-bold uppercase tracking-wider text-accent sm:text-xs">
                    {schedule.matchType || "MATCH"}
                  </span>

                  <p className="whitespace-nowrap text-xl font-black leading-none tracking-wider text-text sm:text-4xl">
                    {formatTime(selectedMatch.timer?.elapsed || 0)}
                  </p>

                  <span className="mt-1 text-[9px] font-medium text-text-muted/50 sm:text-[10px]">
                    {schedule.matchFormat
                      ? `${schedule.matchFormat}v${schedule.matchFormat}`
                      : "MATCH"}
                    <span className="mx-1 text-surface">•</span>
                    {selectedMatch.matchTime || 0} MIN
                  </span>
                </div>

                {/* AWAY */}

                <div className="flex items-center justify-end gap-3 sm:gap-5">
                  <h2 className="text-5xl font-semibold leading-none tracking-tight text-text sm:text-8xl">
                    {score.away}
                  </h2>

                  <div className="flex w-18 shrink-0 flex-col items-center sm:w-24">
                    <div className="flex h-14 w-14 items-center justify-center sm:h-20 sm:w-20">
                      {selectedMatch.awayTeam?.logoLow && (
                        <img
                          src={selectedMatch.awayTeam.logoLow}
                          alt={selectedMatch.awayTeam.name}
                          className="h-full w-full object-contain"
                        />
                      )}
                    </div>

                    <p className="mt-1.5 w-full truncate text-center text-[10px] font-medium text-text-muted sm:text-xs">
                      {selectedMatch.awayTeam?.name || "Away Team"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================
                MATCH DETAILS
            ====================================== */}

            <div className="grid grid-cols-3 divide-x divide-surface border-t border-surface bg-card">
              <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted sm:text-[9px]">
                  Venue
                </p>

                <p className="mt-1 truncate text-[10px] font-semibold text-text sm:text-xs">
                  {venue}
                </p>
              </div>

              <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted sm:text-[9px]">
                  Date
                </p>

                <p className="mt-1 truncate text-[10px] font-semibold text-text sm:text-xs">
                  {schedule.date
                    ? new Date(schedule.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>

              <div className="min-w-0 px-2 py-2.5 text-center sm:px-4 sm:py-3">
                <p className="text-[8px] font-bold uppercase tracking-wider text-text-muted sm:text-[9px]">
                  Time
                </p>

                <p className="mt-1 truncate text-[10px] font-semibold text-text sm:text-xs">
                  {schedule.time || `${selectedMatch.matchTime} MIN`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex md:gap-5 flex-col md:flex-row">
            {/* ======================================
              MATCH ACTIONS
          ====================================== */}

            <div className="w-full mt-5 rounded-2xl bg-card p-3 text-text sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold sm:text-base">
                  Match Actions
                </h2>

                <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  Add Event
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {/* GOAL */}

                <button
                  onClick={openGoalModal}
                  className="group flex flex-col items-center justify-center rounded-xl border border-secondary/50 bg-surface px-2 py-3 text-white transition hover:border-secondary hover:bg-secondary sm:py-4"
                >
                  <span className="text-xl sm:text-2xl">⚽</span>

                  <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                    Goal
                  </span>
                </button>

                {/* PENALTY */}

                <button
                  onClick={openPenaltyModal}
                  className="group flex flex-col items-center justify-center rounded-xl border border-secondary/50 bg-surface px-2 py-3 text-white transition hover:border-secondary hover:bg-secondary sm:py-4"
                >
                  <span className="text-xl sm:text-2xl">🥅</span>

                  <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                    Penalty
                  </span>
                </button>

                {/* OWN GOAL */}

                <button
                  onClick={openOwnGoalModal}
                  className="group flex flex-col items-center justify-center rounded-xl border border-secondary/50 bg-surface px-2 py-3 text-white transition hover:border-secondary hover:bg-secondary sm:py-4"
                >
                  <span className="text-xl sm:text-2xl">🏐</span>

                  <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                    Own Goal
                  </span>
                </button>

                {/* CARD */}

                <button
                  onClick={openCardModal}
                  className="group flex flex-col items-center justify-center rounded-xl border border-secondary/50 bg-surface px-2 py-3 text-white transition hover:border-secondary hover:bg-secondary sm:py-4"
                >
                  <span className="text-xl sm:text-2xl">📕</span>

                  <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                    Cards
                  </span>
                </button>

                {/* SUB */}

                <button
                  onClick={openSubsModal}
                  className="group flex flex-col items-center justify-center rounded-xl border border-secondary/50 bg-surface px-2 py-3 text-white transition hover:border-secondary hover:bg-secondary sm:py-4"
                >
                  <span className="text-xl sm:text-2xl">🔄</span>

                  <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                    Sub
                  </span>
                </button>

                {/* EDIT EVENTS */}

                <button
                  onClick={() => setEditEventsModal(true)}
                  className="group flex flex-col items-center justify-center rounded-xl border border-secondary/50 bg-surface px-2 py-3 text-white transition hover:border-secondary hover:bg-secondary sm:py-4"
                >
                  <span className="text-xl sm:text-2xl">📝</span>

                  <span className="mt-1.5 text-[10px] font-bold sm:text-xs">
                    Edit
                  </span>
                </button>
              </div>
            </div>

            {/* ======================================
              TIMER EDITOR
          ====================================== */}

            <div className="w-full  mt-5 rounded-2xl bg-card p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock size={20} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-text sm:text-base">
                      Match Timer
                    </h2>

                    <p className="text-[10px] text-text-muted sm:text-xs">
                      Correct the final match time
                    </p>
                  </div>
                </div>

                <span className="text-lg font-black text-accent">
                  {formatTime(selectedMatch.timer?.elapsed || 0)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* MINUTES */}

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Minutes
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text outline-none transition focus:border-secondary"
                  />
                </div>

                {/* SECONDS */}

                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-text-muted">
                    Seconds
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text outline-none transition focus:border-secondary"
                  />
                </div>
              </div>

              <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
                <input
                  type="checkbox"
                  checked={timerExtraTime}
                  onChange={(e) => setTimerExtraTime(e.target.checked)}
                  className="h-4 w-4 accent-secondary"
                />

                <p className="text-xs font-semibold text-text">Extra Time</p>
              </label>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={resetTimerInput}
                  className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-text-muted transition hover:text-text"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>

                <button
                  type="button"
                  onClick={updateTimer}
                  className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white transition hover:bg-secondary"
                >
                  Apply Timer
                </button>
              </div>
            </div>
          </div>

          {/* ======================================
              TABS
          ====================================== */}

          <div className="mt-5 rounded-2xl bg-card p-1.5 text-text-muted">
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => setActiveTab("timeline")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "timeline"
                    ? "bg-primary/20 text-text"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                Timeline
              </button>

              <button
                onClick={() => setActiveTab("lineup")}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === "lineup"
                    ? "bg-primary/20 text-text"
                    : "text-text-muted hover:bg-background hover:text-text"
                }`}
              >
                Lineup
              </button>
            </div>
          </div>

          {/* ======================================
              TIMELINE
          ====================================== */}

          {activeTab === "timeline" && (
            <MatchTimeline selectedMatch={selectedMatch} />
          )}

          {/* ======================================
              LINEUP
          ====================================== */}

          {activeTab === "lineup" && (
            <MatchLineup selectedMatch={selectedMatch} />
          )}

          {/* ======================================
              SAVE CHANGES
          ====================================== */}

          <div className="mt-5 rounded-2xl bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-secondary">
                  Ready to Save
                </p>

                <p className="mt-1 text-sm font-semibold text-text">
                  {selectedMatch.homeTeam?.name}
                  <span className="mx-2 text-accent">
                    {score.home} — {score.away}
                  </span>
                  {selectedMatch.awayTeam?.name}
                </p>

                <p className="mt-1 text-[10px] text-text-muted">
                  {(selectedMatch.matchEvents || []).length} total events
                </p>
              </div>

              <button
                type="button"
                onClick={saveScore}
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-secondary/50 px-6 py-3 text-sm font-bold text-text transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={17} />

                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          GOAL MODAL
      ========================================== */}

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

      {/* ==========================================
          PENALTY MODAL
      ========================================== */}

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

      {/* ==========================================
          OWN GOAL MODAL
      ========================================== */}

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

      {/* ==========================================
          CARD MODAL
      ========================================== */}

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

      {/* ==========================================
          SUB MODAL
      ========================================== */}

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

      {/* ==========================================
          EDIT EXISTING EVENTS
      ========================================== */}

      <ModalEdit
        editEventsModal={editEventsModal}
        selectedMatch={selectedMatch}
        closeEditEventsModal={() => setEditEventsModal(false)}
        updateMatchEvent={updateMatchEvent}
        deleteMatchEvent={deleteMatchEvent}
      />
    </>
  );
}

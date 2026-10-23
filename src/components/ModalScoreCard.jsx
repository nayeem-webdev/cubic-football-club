import { useEffect, useRef, useState } from "react";
import {
  X,
  MapPin,
  Clock3,
  Trophy,
  Share2,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import { toPng } from "html-to-image";

import Summary from "./Summary";
import { Timeline } from "./Timeline";
import Lineup from "./Lineup";

const ModalScoreCard = ({ id, onClose }) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("summary");

  // This is ONLY the content that should be shared.
  const cardRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  // =========================================================
  // FETCH SCORE
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const fetchScore = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/scores/detailed/${id}`);

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

        console.log("Score response:", data);

        if (!data?.success || !data?.score) {
          throw new Error("Score data not found");
        }

        const savedScore = data.score;

        /*
         * IMPORTANT
         *
         * Your current API response is:
         *
         * score: {
         *   match: {},
         *   homeTeam: {},
         *   awayTeam: {},
         *   homeScore: 7,
         *   awayScore: 4,
         *   timer: {},
         *   matchEvents: []
         * }
         *
         * Therefore we use savedScore directly.
         */

        const matchData =
          savedScore.match && Object.keys(savedScore.match).length > 0
            ? savedScore.match
            : {};

        const formattedMatch = {
          // =================================================
          // SCORE ID
          // =================================================

          _id: savedScore._id,

          scoreId: savedScore._id,

          // =================================================
          // MATCH
          // =================================================

          match: Object.keys(matchData).length > 0 ? matchData : null,

          // =================================================
          // TEAMS
          // =================================================

          homeTeam: savedScore.homeTeam || matchData.homeTeam || null,

          awayTeam: savedScore.awayTeam || matchData.awayTeam || null,

          // =================================================
          // SCORE
          // =================================================

          homeScore: Number(savedScore.homeScore ?? 0),

          awayScore: Number(savedScore.awayScore ?? 0),

          // =================================================
          // TIMER
          // =================================================

          timer: {
            elapsed: Number(savedScore.timer?.elapsed ?? 0),

            extraTime: Boolean(savedScore.timer?.extraTime),

            finished: Boolean(savedScore.timer?.finished),

            running: false,

            startedAt: null,
          },

          // =================================================
          // EVENTS
          // =================================================

          matchEvents: savedScore.matchEvents || [],

          // =================================================
          // LINEUPS
          //
          // These will work if your endpoint eventually
          // returns them.
          // =================================================

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

          // =================================================
          // MATCH INFORMATION
          // =================================================

          matchType:
            savedScore.matchType ||
            matchData.matchType ||
            matchData.matchSchedule?.matchType ||
            null,

          matchTime:
            savedScore.matchTime ??
            matchData.matchTime ??
            matchData.matchSchedule?.matchTime ??
            null,

          date:
            savedScore.date ||
            matchData.date ||
            matchData.matchSchedule?.date ||
            null,

          venue:
            savedScore.venue ||
            matchData.venue ||
            matchData.matchSchedule?.venue ||
            null,

          matchSchedule:
            savedScore.matchSchedule || matchData.matchSchedule || null,

          // =================================================
          // DATE
          // =================================================

          finishedAt: savedScore.finishedAt,

          createdAt: savedScore.createdAt,

          updatedAt: savedScore.updatedAt,
        };

        console.log("Formatted modal match:", formattedMatch);

        setMatch(formattedMatch);
      } catch (error) {
        console.error("Failed to fetch score:", error);

        setError(error.message || "Failed to load score.");
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [id, API_URL]);

  // =========================================================
  // RESET TAB WHEN OPENING
  // =========================================================

  useEffect(() => {
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab("summary");
    }
  }, [id]);

  // =========================================================
  // ESCAPE
  // =========================================================

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  // =========================================================
  // LOCK BODY SCROLL
  // =========================================================

  useEffect(() => {
    if (!id) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [id]);

  // =========================================================
  // SHARE
  // =========================================================

  const handleShare = async () => {
    const element = cardRef.current;

    if (!element) {
      console.error("Score card element not found");

      return;
    }

    try {
      await document.fonts.ready;

      /*
       * Temporarily remove the scroll limitation while
       * generating the image.
       *
       * This prevents html-to-image from capturing only
       * the visible portion.
       */

      const originalHeight = element.style.height;

      const originalMaxHeight = element.style.maxHeight;

      const originalOverflow = element.style.overflow;

      element.style.height = "auto";
      element.style.maxHeight = "none";
      element.style.overflow = "visible";

      const width = element.scrollWidth;
      const height = element.scrollHeight;

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 4,
        backgroundColor: "#152640",
        width,
        height,
        canvasWidth: width * 4,
        canvasHeight: height * 4,
      });

      // Restore modal state

      element.style.height = originalHeight;
      element.style.maxHeight = originalMaxHeight;
      element.style.overflow = originalOverflow;

      const link = document.createElement("a");

      link.download = `${
        match?.scoreId || match?._id || "score"
      }-score-card.png`;

      link.href = dataUrl;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  // =========================================================
  // MATCH TYPE
  // =========================================================

  const matchType = match?.matchType
    ? `${match.matchType.charAt(0).toUpperCase()}${match.matchType.slice(
        1,
      )} Match`
    : "Match";

  // =========================================================
  // MATCH TIME
  // =========================================================

  const matchTime = match?.matchTime ?? null;

  // =========================================================
  // DATE
  // =========================================================

  const matchDate = match?.date || match?.matchSchedule?.date || null;

  const formattedDate = matchDate
    ? new Date(`${matchDate}T00:00:00+06:00`).toLocaleDateString("en-GB", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  // =========================================================
  // VENUE
  // =========================================================

  const venue =
    match?.venue?.venue ||
    match?.matchSchedule?.venue?.venue ||
    "Venue unavailable";

  // =========================================================
  // TAB CONTENT
  // =========================================================

  const renderTabContent = () => {
    if (!match) return null;

    switch (activeTab) {
      case "summary":
        return <Summary match={match} />;

      case "timeline":
        return <Timeline events={match.matchEvents || []} match={match} />;

      case "lineup":
        return (
          <Lineup
            match={match}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            homeStartingPlayers={match.homeStartingPlayers || []}
            homeSubstitutes={match.homeSubstitutes || []}
            awayStartingPlayers={match.awayStartingPlayers || []}
            awaySubstitutes={match.awaySubstitutes || []}
          />
        );

      default:
        return <Summary match={match} />;
    }
  };

  // =========================================================
  // MODAL
  // =========================================================

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/80 p-2 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      {/* FLEXIBLE MODAL WIDTH */}
      <div className="relative my-2 w-full max-w-[420px] sm:my-4">
        {" "}
        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close score"
          className="absolute right-2 top-2 z-40 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-text transition hover:bg-surface hover:text-accent active:scale-95 sm:-right-3 sm:-top-3"
        >
          <X size={18} />
        </button>
        {/* =================================================
            LOADING
        ================================================= */}
        {loading && (
          <div className="flex min-h-80 w-full items-center justify-center rounded-3xl border border-border bg-card">
            <div className="flex flex-col items-center gap-3 text-text-muted">
              <LoaderCircle size={30} className="animate-spin text-secondary" />

              <p className="text-sm">Loading match...</p>
            </div>
          </div>
        )}
        {/* =================================================
            ERROR
        ================================================= */}
        {!loading && error && (
          <div className="flex min-h-80 w-full flex-col items-center justify-center rounded-3xl border border-red-500/30 bg-card p-6 text-center">
            <AlertCircle size={36} className="mb-4 text-red-400" />

            <h2 className="text-lg font-bold text-text">
              Unable to load match
            </h2>

            <p className="mt-2 max-w-md text-sm text-text-muted">{error}</p>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-xl border border-border bg-surface px-5 py-2 text-sm font-semibold text-text transition hover:bg-primary"
            >
              Close
            </button>
          </div>
        )}
        {/* =================================================
            MATCH CARD
        ================================================= */}
        {!loading && !error && match && (
          <div className="flex max-h-[92vh] w-full flex-col overflow-hidden rounded-3xl border border-border bg-card text-text shadow-2xl">
            {/* =================================================
                  SHAREABLE CONTENT
              ================================================= */}

            <div
              ref={cardRef}
              className="min-h-0 flex-1 overflow-y-auto bg-card"
            >
              {/* =================================================
                    HEADER
                ================================================= */}

              <div className="border-b border-border px-4 py-4 sm:px-6 sm:py-5">
                {/* TOP */}

                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-surface px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-accent sm:text-xs">
                    {matchType}
                  </span>

                  <span className="rounded-full bg-surface px-3 py-1.5 text-[10px] font-semibold text-secondary sm:text-xs">
                    {matchTime || "--"} min
                  </span>
                </div>

                {/* =================================================
                      TEAMS
                  ================================================= */}

                <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:mt-6 sm:gap-5">
                  {/* HOME */}

                  <div className="flex min-w-0 flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 p-2 sm:h-18 sm:w-18 lg:h-20 lg:w-20">
                      {match.homeTeam?.logoLow ? (
                        <img
                          src={match.homeTeam.logoLow}
                          alt={match.homeTeam.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-text-muted">N/A</span>
                      )}
                    </div>

                    <h3 className="mt-2 w-full max-w-25 break-words text-center text-[11px] font-semibold leading-tight sm:max-w-36 sm:text-sm lg:max-w-44 lg:text-base">
                      {match.homeTeam?.name || "Home Team"}
                    </h3>
                  </div>

                  {/* SCORE */}

                  <div className="min-w-22 text-center sm:min-w-28">
                    <div className="whitespace-nowrap text-2xl font-black tracking-tight sm:text-4xl">
                      {match.homeScore}

                      <span className="mx-1.5 text-text-muted sm:mx-2.5">
                        -
                      </span>

                      {match.awayScore}
                    </div>

                    <p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-text-muted sm:text-[10px] sm:tracking-[0.22em]">
                      FINAL SCORE
                    </p>
                  </div>

                  {/* AWAY */}

                  <div className="flex min-w-0 flex-col items-center">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 p-2 sm:h-18 sm:w-18 lg:h-20 lg:w-20">
                      {match.awayTeam?.logoLow ? (
                        <img
                          src={match.awayTeam.logoLow}
                          alt={match.awayTeam.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-[10px] text-text-muted">N/A</span>
                      )}
                    </div>

                    <h3 className="mt-2 w-full max-w-25 break-words text-center text-[11px] font-semibold leading-tight sm:max-w-36 sm:text-sm lg:max-w-44 lg:text-base">
                      {match.awayTeam?.name || "Away Team"}
                    </h3>
                  </div>
                </div>

                {/* =================================================
                      MATCH INFO
                  ================================================= */}

                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[10px] text-text-muted sm:mt-5 sm:gap-x-5 sm:text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock3 size={13} className="shrink-0" />

                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="shrink-0" />

                    <span className="max-w-45 truncate">{venue}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Trophy size={13} className="shrink-0" />

                    <span>{matchType}</span>
                  </div>
                </div>
              </div>

              {/* =================================================
                    TABS
                ================================================= */}

              <div className="border-b border-border bg-surface/40">
                <div className="grid grid-cols-3">
                  {[
                    {
                      id: "summary",
                      label: "Summary",
                    },
                    {
                      id: "timeline",
                      label: "Timeline",
                    },
                    {
                      id: "lineup",
                      label: "Lineup",
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex h-11 items-center justify-center text-xs font-semibold transition sm:h-12 sm:text-sm ${
                        activeTab === tab.id
                          ? "text-accent"
                          : "text-text-muted hover:text-text"
                      }`}
                    >
                      {tab.label}

                      {activeTab === tab.id && (
                        <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-accent sm:left-8 sm:right-8" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* =================================================
                    TAB CONTENT
                ================================================= */}

              <div className="p-3 sm:p-5">{renderTabContent()}</div>
            </div>

            {/* =================================================
                  SHARE BUTTON
                  NOT INSIDE cardRef
              ================================================= */}

            <div className="shrink-0 border-t border-border bg-card p-3 sm:p-4">
              <button
                type="button"
                onClick={handleShare}
                className="group flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-accent/50 bg-accent/5 px-6 text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/10 active:scale-[0.98]"
              >
                <Share2
                  size={16}
                  className="transition-transform duration-200 group-hover:-translate-y-0.5"
                />

                <span>Share</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalScoreCard;

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock3,
  Trophy,
  Share2,
} from "lucide-react";
import { toPng } from "html-to-image";
import Summary from "./Summary";
import { Timeline } from "./Timeline";
import Lineup from "./Lineup";

const ScoreCard = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const cardRef = useRef(null);

  const handleShare = async () => {
    const element = cardRef.current;

    if (!element) {
      console.error("Player card element not found");
      return;
    }

    try {
      await document.fonts.ready;

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 4,
        backgroundColor: "#152640",
      });

      const link = document.createElement("a");
      link.download = `${match._id}-score-card.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const matchType = match.match?.matchSchedule?.matchType
    ? `${match.match.matchSchedule?.matchType.charAt(0).toUpperCase()}${match.match.matchSchedule?.matchType.slice(1)} Match`
    : "Random Match";

  return (
    <div
      className="overflow-hidden rounded-3xl transition-all duration-300 bg-card border-border"
      ref={cardRef}
    >
      {/* HEADER */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize text-accent bg-surface">
            {matchType}
          </span>

          <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize text-secondary bg-surface">
            {match.match?.matchTime} min
          </span>
        </div>

        {/* TEAMS */}
        <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
          {/* HOME */}
          <div className="flex w-full flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 p-2 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              <img
                src={match.homeTeam?.logoLow}
                alt={match.homeTeam?.name}
                className="h-full w-full object-contain"
              />
            </div>

            <h3 className="mt-3 max-w-25 wrap-break-word text-center text-sm font-semibold sm:max-w-35 sm:text-base lg:max-w-45 lg:text-lg">
              {match.homeTeam?.name}
            </h3>
          </div>

          {/* SCORE */}
          <div className="text-center">
            <div className="text-3xl font-black tracking-tight md:text-5xl ">
              {match.homeScore}
              <span className="mx-3 text-muted">-</span>
              {match.awayScore}
            </div>

            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted">
              FINAL SCORE
            </p>
          </div>

          {/* AWAY */}
          <div className="flex w-full flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 p-2 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              <img
                src={match.awayTeam?.logoLow}
                alt={match.awayTeam?.name}
                className="h-full w-full object-contain"
              />
            </div>

            <h3 className="mt-3 max-w-25 wrap-break-word text-center text-sm font-semibold sm:max-w-35 sm:text-base lg:max-w-45 lg:text-lg">
              {match.awayTeam?.name}
            </h3>
          </div>
        </div>

        {/* MATCH INFO */}
        <div className="mt-6 flex flex-wrap text-muted items-center justify-center gap-5 text-sm">
          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {match.match?.matchSchedule?.date
              ? new Date(
                  `${match.match.matchSchedule.date}T00:00:00+06:00`,
                ).toLocaleDateString("en-GB", {
                  timeZone: "Asia/Dhaka",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Date unavailable"}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {match.match?.matchSchedule?.venue?.venue || "Venue unavailable"}
          </div>

          <div className="flex items-center gap-2">
            <Trophy size={16} />
            {matchType}
          </div>
        </div>
      </div>

      {/* EXPANDED CONTENT */}
      <div
        className={`grid transition-all duration-500 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6">
            {/* TABS */}
            <div className="rounded-xl border border-border text-muted">
              <div className="relative grid grid-cols-3">
                <div
                  className={`absolute inset-y-0 left-0 w-1/3 rounded-xl bg-primary/15 transition-transform duration-300 ease-out ${
                    activeTab === "summary"
                      ? "translate-x-0"
                      : activeTab === "timeline"
                        ? "translate-x-full"
                        : "translate-x-[200%]"
                  }`}
                />

                <button
                  onClick={() => setActiveTab("summary")}
                  className={`relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    activeTab === "summary"
                      ? "text-text"
                      : "text-muted/80 hover:text-text"
                  }`}
                >
                  Summary
                </button>

                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    activeTab === "timeline"
                      ? "text-text"
                      : "text-muted/80 hover:text-text"
                  }`}
                >
                  Timeline
                </button>

                <button
                  onClick={() => setActiveTab("lineup")}
                  className={`relative z-10 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    activeTab === "lineup"
                      ? "text-text"
                      : "text-muted/80 hover:text-text"
                  }`}
                >
                  Lineup
                </button>
              </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === "summary" && <Summary matchData={match} />}
            {activeTab === "timeline" && <Timeline matchData={match} />}
            {activeTab === "lineup" && <Lineup match={match} />}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:items-center sm:justify-center">
        {/* EXPAND BUTTON */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-full bg-surface border border-border items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 active:scale-98 sm:w-auto sm:px-6"
        >
          <span>{open ? "Hide Match Details" : "View Match Details"}</span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* SHARE BUTTON */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share match scorecard"
          className="group  border border-accent/50 bg-accent/5  text-accent duration-300 hover:border-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/10              flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 active:scale-98 sm:w-auto sm:px-6"
        >
          <Share2
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ScoreCard;

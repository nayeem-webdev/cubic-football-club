import { useRef, useState } from "react";
import { MapPin, Clock3, Trophy, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import ModalScoreCard from "./ModalScoreCard";

const ScoreCard = ({ match }) => {
  const [selectedScoreId, setSelectedScoreId] = useState(null);
  const cardRef = useRef(null);

  const handleShare = async () => {
    const element = cardRef.current;

    if (!element) {
      console.error("Score card element not found");
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

  const matchType = match.matchType
    ? `${match.matchType.charAt(0).toUpperCase()}${match.matchType.slice(1)} Match`
    : "Random Match";

  const formattedDate = match.date
    ? new Date(`${match.date}T00:00:00+06:00`).toLocaleDateString("en-GB", {
        timeZone: "Asia/Dhaka",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date unavailable";

  return (
    <div
      ref={cardRef}
      className="overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300"
    >
      {/* HEADER */}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold capitalize text-accent">
            {matchType}
          </span>

          <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-secondary">
            {match.matchTime || "--"} min
          </span>
        </div>

        {/* TEAMS */}
        <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
          {/* HOME */}
          <div className="flex w-full flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 p-2 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              {match.homeTeam?.logoLow && (
                <img
                  src={match.homeTeam.logoLow}
                  alt={match.homeTeam.name}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <h3 className="mt-3 max-w-25 wrap-break-word text-center text-sm font-semibold sm:max-w-35 sm:text-base lg:max-w-45 lg:text-lg">
              {match.homeTeam?.name || "Home Team"}
            </h3>
          </div>

          {/* SCORE */}
          <div className="text-center">
            <div className="text-3xl font-black tracking-tight md:text-5xl">
              {match.homeScore}
              <span className="mx-3 text-text-muted">-</span>
              {match.awayScore}
            </div>

            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-text-muted">
              FINAL SCORE
            </p>
          </div>

          {/* AWAY */}
          <div className="flex w-full flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white/5 p-2 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              {match.awayTeam?.logoLow && (
                <img
                  src={match.awayTeam.logoLow}
                  alt={match.awayTeam.name}
                  className="h-full w-full object-contain"
                />
              )}
            </div>

            <h3 className="mt-3 max-w-25 wrap-break-word text-center text-sm font-semibold sm:max-w-35 sm:text-base lg:max-w-45 lg:text-lg">
              {match.awayTeam?.name || "Away Team"}
            </h3>
          </div>
        </div>

        {/* MATCH INFO */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-text-muted">
          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {formattedDate}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {match.venue?.venue || "Venue unavailable"}
          </div>

          <div className="flex items-center gap-2">
            <Trophy size={16} />
            {matchType}
          </div>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:items-center sm:justify-center">
        {/* FUTURE DETAILS BUTTON */}
        <button
          type="button"
          onClick={() => setSelectedScoreId(match._id)}
          className="flex h-11 w-full items-center justify-center rounded-xl border border-black bg-black px-6 text-sm font-semibold text-white transition hover:bg-zinc-900 active:scale-[0.98] sm:w-auto"
        >
          View Match Details
        </button>

        {/* SHARE BUTTON */}
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share match scorecard"
          className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-accent/50 bg-accent/5 text-sm font-semibold text-accent transition duration-300 hover:border-accent hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/10 active:scale-98 sm:w-auto sm:px-6"
        >
          <Share2
            size={16}
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          />

          <span>Share</span>
        </button>
      </div>
      {selectedScoreId && (
        <ModalScoreCard
          id={selectedScoreId}
          onClose={() => setSelectedScoreId(null)}
        />
      )}
    </div>
  );
};

export default ScoreCard;

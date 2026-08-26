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

const PlayerRow = ({ player, side, substitute = false }) => {
  const isHome = side === "home";

  return (
    <div
      className={`group flex items-center gap-2 rounded-xl border px-2 py-2 transition-all sm:px-2.5 ${
        substitute
          ? "border-[#28466B]/60 bg-[#07111F]/30"
          : "border-[#28466B] bg-[#07111F]/60 hover:border-[#49C85A]/40"
      } ${isHome ? "" : "flex-row-reverse text-right"}`}
    >
      {/* PLAYER PHOTO */}

      <div className="relative shrink-0">
        <div
          className={`h-9 w-9 overflow-hidden rounded-full border bg-[#28466B] sm:h-10 sm:w-10 ${
            substitute ? "border-[#28466B]" : "border-[#49C85A]/30"
          }`}
        >
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#B8C2D1]">
              {player.name?.charAt(0)}
            </div>
          )}
        </div>

        {/* JERSEY NUMBER */}

        <span
          className={`absolute -bottom-1 ${
            isHome ? "-right-1" : "-left-1"
          } flex h-4 min-w-4 items-center justify-center rounded-md border border-[#0E1D34] bg-[#28466B] px-1 text-[8px] font-bold text-[#F8FAFC]`}
        >
          {player.jerseyNumber}
        </span>
      </div>

      {/* PLAYER INFO */}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[#F8FAFC] sm:text-xs">
          {player.name}
        </p>

        <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-[#B8C2D1]/40">
          {player.position}
        </p>
      </div>
    </div>
  );
};

const ScoreCard = ({ match }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("timeline");
  // -----------------------------------------
  // Share Card
  // -----------------------------------------
  const cardRef = useRef(null);

  const handleShare = async () => {
    const element = cardRef.current;

    console.log("Share clicked");
    console.log("Element:", element);

    if (!element) {
      console.error("Player card element not found");
      return;
    }

    try {
      await document.fonts.ready;

      console.log("Generating image...");

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

  // -----------------------------------------
  // ALL PLAYERS
  // -----------------------------------------

  const players = [
    ...(match.homeStartingPlayers || []),
    ...(match.homeSubstitutes || []),
    ...(match.awayStartingPlayers || []),
    ...(match.awaySubstitutes || []),
  ];

  // -----------------------------------------
  // GET PLAYER NAME FROM ID
  // -----------------------------------------

  const getPlayerName = (playerId) => {
    const player = players.find((p) => String(p._id) === String(playerId));

    return player?.name || "Unknown Player";
  };
  const matchType = match.match?.matchType
    ? `${match.match.matchType.charAt(0).toUpperCase()}${match.match.matchType.slice(1)} Match`
    : "Random Match";
  // -----------------------------------------
  // EVENTS
  // -----------------------------------------
  const events = [...(match.matchEvents || [])].sort(
    (a, b) => (a.time ?? 0) - (b.time ?? 0),
  );

  // -----------------------------------------
  // EVENT ICON
  // -----------------------------------------

  const eventIcon = (event) => {
    switch (event.type) {
      case "goal":
        return "⚽";

      case "penalty":
        return "🥅";

      case "ownGoal":
        return "↩";

      case "card":
        return event.card === "yellow" ? "🟨" : "🟥";

      case "substitution":
        return "🔄";

      default:
        return "•";
    }
  };

  // -----------------------------------------
  // EVENT TEXT
  // -----------------------------------------

  const getEventText = (event) => {
    switch (event.type) {
      case "goal":
        return getPlayerName(event.scorer);

      case "penalty":
        return `${getPlayerName(event.scorer)} (P)`;

      case "ownGoal":
        return `${getPlayerName(event.scorer)} (OG)`;

      case "card":
        return getPlayerName(event.player);

      case "substitution":
        return `${getPlayerName(event.playerOut)} → ${getPlayerName(
          event.playerIn,
        )}`;

      default:
        return "Unknown Event";
    }
  };

  // -----------------------------------------
  // EVENT TIME
  // -----------------------------------------

  const getEventTime = (event) => {
    if (event.time === undefined || event.time === null) {
      return "";
    }

    const minutes = Math.floor(event.time / 60);

    return `${minutes}'`;
  };

  return (
    <div
      className="overflow-hidden rounded-3xl transition-all duration-300"
      ref={cardRef}
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* HEADER */}

      <div className="p-6">
        {/* Competition */}

        <div className="flex items-center justify-between">
          <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize text-secondary bg-surface">
            {matchType}
          </span>

          <span className="rounded-full px-3 py-1 text-xs font-semibold capitalize  text-accent bg-surface">
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
            <div className="text-3xl font-black tracking-tight md:text-5xl">
              {match.homeScore}

              <span
                className="mx-3"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                -
              </span>

              {match.awayScore}
            </div>

            <p
              className="mt-2 text-xs uppercase tracking-[0.25em]"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
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

        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm"
          style={{
            color: "var(--color-text-muted)",
          }}
        >
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

        {/* EXPAND */}

        <button
          onClick={() => setOpen(!open)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {open ? "Hide Match Details" : "View Match Details"}

          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Expanded */}
      <div
        className={`grid transition-all duration-500 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className="p-4 sm:p-6"
            style={{
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {/* TABS */}

            <div className="rounded-xl border border-[#28466B] bg-[#0E1D34]">
              <div className="relative grid grid-cols-2">
                {/* SLIDING ACTIVE BACKGROUND */}
                <div
                  className={`absolute inset-y-0 left-0 w-1/2 rounded-xl bg-[#0E5FD8]/15 transition-transform duration-300 ease-out ${
                    activeTab === "lineup"
                      ? "translate-x-full"
                      : "translate-x-0"
                  }`}
                />

                {/* TIMELINE */}
                <button
                  onClick={() => setActiveTab("timeline")}
                  className={`relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    activeTab === "timeline"
                      ? "text-[#F8FAFC]"
                      : "text-[#B8C2D1]/60 hover:text-[#F8FAFC]"
                  }`}
                >
                  Timeline
                </button>

                {/* LINEUP */}
                <button
                  onClick={() => setActiveTab("lineup")}
                  className={`relative z-10 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    activeTab === "lineup"
                      ? "text-[#F8FAFC]"
                      : "text-[#B8C2D1]/60 hover:text-[#F8FAFC]"
                  }`}
                >
                  Lineup
                </button>
              </div>
            </div>

            {/* ========================================= */}
            {/* TEAM HEADER */}
            {/* ========================================= */}

            <div className="grid grid-cols-2 border-b border-[#28466B]">
              {/* HOME */}

              <div className="flex items-center gap-2.5 border-r border-[#28466B] px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
                  <img
                    src={match.homeTeam.logoLow}
                    alt={match.homeTeam.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#49C85A]">
                    HOME
                  </p>

                  <p className="truncate text-xs font-semibold text-[#F8FAFC] sm:text-sm">
                    {match.homeTeam.name}
                  </p>
                </div>
              </div>

              {/* AWAY */}

              <div className="flex items-center justify-end gap-2.5 px-4 py-3 text-right">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#49C85A]">
                    AWAY
                  </p>

                  <p className="truncate text-xs font-semibold text-[#F8FAFC] sm:text-sm">
                    {match.awayTeam.name}
                  </p>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center">
                  <img
                    src={match.awayTeam.logoLow}
                    alt={match.awayTeam.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
            {/* TIMELINE */}

            {activeTab === "timeline" && (
              <div className="mt-6">
                {events.length === 0 ? (
                  <p
                    className="py-6 text-center text-sm"
                    style={{
                      color: "var(--color-text-muted)",
                    }}
                  >
                    No match events
                  </p>
                ) : (
                  <div className="relative">
                    {/* CENTER LINE */}
                    <div
                      className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2"
                      style={{
                        background: "var(--color-border)",
                      }}
                    />

                    <div className="space-y-5">
                      {events.map((event) => {
                        const isHome = event.team === "home";

                        return (
                          <div
                            key={event.id}
                            className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
                          >
                            {/* HOME SIDE */}
                            <div
                              className={
                                isHome
                                  ? "flex items-center justify-end gap-2 text-right"
                                  : ""
                              }
                            >
                              {isHome && (
                                <>
                                  <div>
                                    <p className="text-sm font-semibold">
                                      {getEventText(event)}
                                    </p>

                                    <p
                                      className="mt-0.5 text-xs"
                                      style={{
                                        color: "var(--color-text-muted)",
                                      }}
                                    >
                                      {match.homeTeam?.shortForm}
                                    </p>
                                  </div>

                                  <span className="text-base">
                                    {eventIcon(event)}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* CENTER TIME */}
                            <div
                              className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold"
                              style={{
                                background: "var(--color-surface)",
                                border: "1px solid var(--color-border)",
                                color: "var(--color-secondary)",
                              }}
                            >
                              {getEventTime(event)}
                            </div>

                            {/* AWAY SIDE */}
                            <div>
                              {!isHome && (
                                <div className="flex items-center gap-2">
                                  <span className="text-base">
                                    {eventIcon(event)}
                                  </span>

                                  <div>
                                    <p className="text-sm font-semibold">
                                      {getEventText(event)}
                                    </p>

                                    <p
                                      className="mt-0.5 text-xs"
                                      style={{
                                        color: "var(--color-text-muted)",
                                      }}
                                    >
                                      {match.awayTeam?.shortForm}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LINEUP */}

            {activeTab === "lineup" && (
              <div className="mt-6 ">
                {/* ========================================= */}
                {/* STARTING PLAYERS */}
                {/* ========================================= */}

                <div className="px-4 sm:px-5">
                  <div className="mb-3 flex items-center justify-center">
                    <span className="rounded-full bg-[#07111F] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B8C2D1]/50">
                      Starting Players
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
                    {/* HOME */}

                    <div className="space-y-2">
                      {match.homeStartingPlayers.map((player) => (
                        <PlayerRow
                          key={player._id}
                          player={player}
                          side="home"
                        />
                      ))}
                    </div>

                    {/* AWAY */}

                    <div className="space-y-2">
                      {match.awayStartingPlayers.map((player) => (
                        <PlayerRow
                          key={player._id}
                          player={player}
                          side="away"
                        />
                      ))}
                    </div>
                  </div>

                  {/* ========================================= */}
                  {/* SUBSTITUTES */}
                  {/* ========================================= */}

                  {(match.homeSubstitutes.length > 0 ||
                    match.awaySubstitutes.length > 0) && (
                    <div className="mt-6 border-t border-[#28466B] pt-4">
                      <div className="mb-3 flex items-center justify-center">
                        <span className="rounded-full bg-[#07111F] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B8C2D1]/40">
                          Substitutes
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
                        {/* HOME SUBS */}

                        <div className="space-y-2">
                          {match.homeSubstitutes.map((player) => (
                            <PlayerRow
                              key={player._id}
                              player={player}
                              side="home"
                              substitute
                            />
                          ))}
                        </div>

                        {/* AWAY SUBS */}

                        <div className="space-y-2">
                          {match.awaySubstitutes.map((player) => (
                            <PlayerRow
                              key={player._id}
                              player={player}
                              side="away"
                              substitute
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Button */}
      <div className="flex justify-center mb-6">
        <button
          type="button"
          onClick={handleShare}
          aria-label="Share player"
          className="group flex w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/50 bg-[#D4AF37]/5 px-6 py-2 font-semibold text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-lg hover:shadow-[#D4AF37]/10 active:scale-95 sm:w-auto"
        >
          <Share2
            size={15}
            className="transition-transform duration-200 group-hover:-translate-y-0.5"
          />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ScoreCard;

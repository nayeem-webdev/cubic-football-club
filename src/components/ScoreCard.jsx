import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Clock3 } from "lucide-react";

const ScoreCard = ({ match }) => {
  const [open, setOpen] = useState(false);

  const homeEvents = match.events.filter((e) => e.team === "home");
  const awayEvents = match.events.filter((e) => e.team === "away");

  const eventIcon = (type) => {
    switch (type) {
      case "goal":
        return "⚽";

      case "penalty-goal":
        return "⚽";

      case "yellow":
        return "🟨";

      case "red":
        return "🟥";

      default:
        return "•";
    }
  };

  return (
    <div
      className="overflow-hidden rounded-3xl transition-all duration-300"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
      }}
    >
      {/* Header */}

      <div className="p-6">
        {/* Competition */}

        <div className="flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold"
            style={{
              background: "var(--color-surface)",
              color: "var(--color-secondary)",
            }}
          >
            {match.competition}
          </span>

          <span
            className="text-sm font-semibold"
            style={{
              color:
                match.status === "FT"
                  ? "var(--color-accent)"
                  : "var(--color-primary)",
            }}
          >
            {match.status}
          </span>
        </div>

        {/* Teams */}

        <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center gap-5">
          {/* Home */}

          <div className="flex flex-col items-center w-full">
            <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/5 p-2 flex items-center justify-center overflow-hidden">
              <img
                src={match.homeTeam.logo}
                alt={match.homeTeam.name}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="mt-3 text-center font-semibold text-sm sm:text-base lg:text-lg break-words max-w-[100px] sm:max-w-[140px] lg:max-w-[180px]">
              {match.homeTeam.name}
            </h3>
          </div>

          {/* Score */}

          <div className="text-center">
            <div className="text-3xl md:text-5xl font-black tracking-tight">
              {match.homeTeam.score}

              <span
                className="mx-3"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                -
              </span>

              {match.awayTeam.score}
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

          {/* Away */}

          <div className="flex flex-col items-center w-full">
            <div className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-white/5 p-2 flex items-center justify-center overflow-hidden">
              <img
                src={match.awayTeam.logo}
                alt={match.awayTeam.name}
                className="w-full h-full object-contain"
              />
            </div>

            <h3 className="mt-3 text-center font-semibold text-sm sm:text-base lg:text-lg break-words max-w-[100px] sm:max-w-[140px] lg:max-w-[180px]">
              {match.awayTeam.name}
            </h3>
          </div>
        </div>

        {/* Match Info */}

        <div
          className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm"
          style={{
            color: "var(--color-text-muted)",
          }}
        >
          <div className="flex items-center gap-2">
            <Clock3 size={16} />
            {match.date}
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={16} />
            {match.venue}
          </div>
        </div>

        {/* Expand */}

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
            className="grid grid-cols-2 gap-6 lg:gap-10 p-6"
            style={{
              borderTop: "1px solid var(--color-border)",
            }}
          >
            {/* Home */}

            <div>
              <h4 className="mb-4 font-semibold">{match.homeTeam.name}</h4>

              <div
                className="text-sm flex flex-col gap-2"
                style={{ color: "var(--color-text)" }}
              >
                {homeEvents.map((event, index) => (
                  <span key={index}>
                    {eventIcon(event.type)}{" "}
                    <span className="font-medium">{event.player}</span>{" "}
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {event.minute}'
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Away */}

            <div>
              <h4 className="mb-4 text-right font-semibold">
                {match.awayTeam.name}
              </h4>

              <div
                className="text-right text-sm flex flex-col gap-2"
                style={{ color: "var(--color-text)" }}
              >
                {awayEvents.map((event, index) => (
                  <span key={index}>
                    {eventIcon(event.type)}{" "}
                    <span className="font-medium">{event.player}</span>{" "}
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {event.minute}'
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;

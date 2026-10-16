import {
  FaCalendar,
  FaCalendarCheck,
  FaClock,
  FaDiamondTurnRight,
  FaShare,
  FaUserGroup,
  FaVolleyball,
} from "react-icons/fa6";

const ScheduleCard = ({ schedule }) => {
  function getStatus(dateStr) {
    const now = new Date();

    const bangladeshDate = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Dhaka",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    const matchDate = dateStr;

    if (matchDate === bangladeshDate) {
      return "today";
    }

    if (matchDate > bangladeshDate) {
      return "upcoming";
    }

    return "completed";
  }
  const status = getStatus(schedule.date);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl  bg-card p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-hover hover:shadow-2xl">
      {/* Subtle top secondary */}
      {/* <div className="absolute left-0 right-0 top-0 h-1 bg-linear-to-r from-primary to-secondary" /> */}

      {/* ================= HEADER ================= */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Football Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10 text-lg text-secondary">
            <FaVolleyball />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-text sm:text-lg">
              {schedule.venue?.venue || schedule.venue || "Unknown Venue"}
            </h3>

            <p className="mt-0.5 text-xs text-accent">
              {schedule.matchType
                ? `${schedule.matchType.charAt(0).toUpperCase() + schedule.matchType.slice(1)} Match`
                : "Training Match"}
            </p>
          </div>
        </div>

        {/* Status */}
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${
            status === "today"
              ? "border-accent/40 bg-accent/15 text-accent"
              : status === "upcoming"
                ? "border-secondary/40 bg-secondary/15 text-secondary"
                : "border-gray-400/40 bg-gray-400/15 text-gray-400"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              status === "today"
                ? "bg-accent"
                : status === "upcoming"
                  ? "bg-secondary"
                  : "bg-gray-400"
            }`}
          />

          {status === "today"
            ? "Today"
            : status === "upcoming"
              ? "Upcoming"
              : "Completed"}
        </span>
      </div>

      {/* Divider */}
      <div className="mb-5 h-px w-full bg-linear-to-r from-secondary/30 to-transparent" />

      {/* ================= MATCH DETAILS ================= */}
      <div className="mb-6 space-y-3 text-sm">
        {/* Date */}
        <div className="flex items-center gap-3">
          <FaCalendar className="w-4 shrink-0 text-secondary" />

          <span className="text-muted">Date:</span>

          <span className="ml-auto font-semibold text-text">
            {new Date(schedule.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Day */}
        <div className="flex items-center gap-3">
          <FaCalendarCheck className="w-4 shrink-0 text-secondary" />

          <span className="text-muted">Day:</span>

          <span className="ml-auto font-semibold text-text">
            {new Date(schedule.date).toLocaleDateString("en-US", {
              weekday: "long",
            })}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3">
          <FaClock className="w-4 shrink-0 text-secondary" />

          <span className="text-muted">Time:</span>

          <span className="ml-auto font-semibold text-text">
            {schedule.time}
          </span>
        </div>

        {/* Format */}
        {schedule.matchFormat && (
          <div className="flex items-center gap-3">
            <FaUserGroup className="w-4 shrink-0 text-secondary" />

            <span className="text-muted">Format:</span>

            <span className="ml-auto font-semibold text-text">
              {schedule.matchFormat} vs {schedule.matchFormat}
            </span>
          </div>
        )}
      </div>

      {/* ================= DIRECTION ================= */}
      <div className="flex w-full gap-4">
        <a
          href={schedule.venue?.direction || schedule.direction}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 group  border border-secondary/20 bg-secondary/5 text-text duration-300 hover:border-secondary/50 hover:bg-secondary/10 hover:shadow-lg hover:shadow-secondary/10 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 active:scale-98 sm:w-auto sm:px-6"
        >
          <FaDiamondTurnRight className="text-xs" />
          <span>Get Direction</span>
        </a>

        <a
          href={schedule.venue?.direction || schedule.direction}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 group  border border-accent/20 bg-accent/5 text-accent duration-300 hover:border-accent/50 hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/10 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 active:scale-98 sm:w-auto sm:px-6"
        >
          <FaShare className="text-xs" />
          <span>Match Poster</span>
        </a>
      </div>
    </div>
  );
};

export default ScheduleCard;

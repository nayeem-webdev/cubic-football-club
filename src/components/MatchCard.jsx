import { Link } from "react-router-dom";
import {
  FaCalendar,
  FaCalendarCheck,
  FaClock,
  FaUserGroup,
  FaVolleyball,
} from "react-icons/fa6";
import { HiOutlineChevronRight } from "react-icons/hi";
const MatchCard = ({ match }) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  const schedule = match.matchSchedule || {};
  const homeTeam = match.homeTeam || {};
  const awayTeam = match.awayTeam || {};
  const status = getStatus(match.date);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl  bg-card p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary-hover hover:shadow-2xl">
      {/* Subtle top accent gradient */}
      {/* <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#0E5FD8] to-secondary" /> */}

      {/* ================= HEADER ================= */}
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {/* Football Badge Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10 text-lg text-secondary">
            <FaVolleyball />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-text sm:text-lg">
              {schedule.venue?.venue || "Match Fixture"}
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

      {/* ================= TEAMS VS SECTION ================= */}
      <div className="mb-5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Home Team */}
          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            <div className="mb-2 flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
              <img
                src={homeTeam.logoLow}
                alt={homeTeam.name || "Home Team"}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h4 className="w-full truncate text-xs font-bold text-text sm:text-sm">
              {homeTeam.name || "Home Team"}
            </h4>

            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Home
            </span>
          </div>

          {/* VS Divider */}
          <div className="flex shrink-0 flex-col items-center justify-center">
            <span className="font-minasans text-3xl font-black italic tracking-wider text-secondary sm:text-4xl md:text-5xl">
              VS
            </span>
          </div>

          {/* Away Team */}
          <div className="flex min-w-0 flex-1 flex-col items-center text-center">
            <div className="mb-2 flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
              <img
                src={awayTeam.logoLow}
                alt={awayTeam.name || "Away Team"}
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <h4 className="w-full truncate text-xs font-bold text-text sm:text-sm">
              {awayTeam.name || "Away Team"}
            </h4>

            <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted">
              Away
            </span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mb-5 h-px w-full bg-linear-to-r to-secondary/30 from-transparent" />

      {/* ================= MATCH DETAILS ================= */}
      <div className="mb-6 space-y-3 text-sm">
        {/* Date */}
        <div className="flex items-center gap-3">
          <FaCalendar className="w-4 shrink-0 text-secondary" />
          <span className="text-muted">Date:</span>
          <span className="ml-auto font-semibold text-text">
            {formatDate ? formatDate(schedule.date) : schedule.date}
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
            {schedule.time || "TBD"}
          </span>
        </div>

        {/* Format */}
        <div className="flex items-center gap-3">
          <FaUserGroup className="w-4 shrink-0 text-secondary" />
          <span className="text-muted">Format:</span>
          <span className="ml-auto font-semibold text-text">
            {schedule.matchFormat} vs {schedule.matchFormat}
          </span>
        </div>
      </div>

      {/* ================= ACTION BUTTON ================= */}
      <Link
        to={`/upcoming-matches/${match._id}`}
        className="group  border border-accent/20 bg-accent/5 text-accent duration-300 hover:border-accent/50 hover:bg-accent/10 hover:shadow-lg hover:shadow-accent/10 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold transition hover:opacity-90 active:scale-98 sm:w-auto sm:px-6"
      >
        <span>View Match Poster</span>
        <HiOutlineChevronRight className="text-base transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
};

export default MatchCard;

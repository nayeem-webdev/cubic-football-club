import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import { IoFootball } from "react-icons/io5";
import { FaCalendar, FaCalendarCheck, FaClock } from "react-icons/fa6";
import { HiOutlineChevronRight } from "react-icons/hi";

const API_URL = import.meta.env.VITE_API_URL;

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/matches`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch matches");
        }

        setMatches(data.matches || []);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

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

    if (matchDate < bangladeshDate) {
      return "completed";
    }

    return "upcoming";
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background px-4 py-16 text-text">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 text-text-muted p-8 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
          <h2 className="text-lg font-semibold">Unable to load matches</h2>
          <p className="mt-2 text-sm text-text-muted">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        {/* Hero */}
        <PageHero
          text={"CUBIC FC"}
          heading={"Matches"}
          subheading={
            "Follow upcoming fixtures, friendly matches, and previous games."
          }
        />

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-text-muted">No matches available.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => {
              const schedule = match.matchSchedule || {};
              const homeTeam = match.homeTeam || {};
              const awayTeam = match.awayTeam || {};
              const status = getStatus(match.date);

              return (
                <Link
                  key={match._id}
                  to={`/upcoming-matches/${match._id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-[#061834ac] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#3a82ff54] hover:shadow-2xl"
                >
                  {/* Background Subtle Gradient Glows */}

                  {/* Subtle top accent gradient */}
                  <div className="absolute left-0 right-0 top-0 h-1 bg-gradient-to-r from-[#0E5FD8] to-secondary" />

                  {/* ================= HEADER ================= */}
                  <div className="mb-5 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {/* Football Badge Icon */}
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-secondary/20 bg-secondary/10 text-lg text-secondary">
                        <IoFootball />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-text sm:text-lg">
                          {schedule.venue?.venue || "Match Fixture"}
                        </h3>

                        <p className="mt-0.5 text-xs text-secondary">
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
                          ? "border-primary/40 bg-primary/15 text-primary"
                          : status === "upcoming"
                            ? "border-accent/30 bg-accent/10 text-accent"
                            : "border-gray-400/30 bg-gray-400/10 text-gray-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          status === "today"
                            ? "bg-primary"
                            : status === "upcoming"
                              ? "bg-accent"
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
                  <div className="mb-5 h-px w-full bg-linear-to-r from-surface to-transparent" />

                  {/* ================= TEAMS VS SECTION ================= */}
                  <div className="mb-6">
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

                        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
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

                        <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                          Away
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mb-5 h-px w-full bg-linear-to-l from-surface to-transparent" />

                  {/* ================= MATCH DETAILS ================= */}
                  <div className="mb-6 space-y-3 text-sm">
                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <FaCalendar className="w-4 shrink-0 text-secondary" />
                      <span className="text-text-muted">Date:</span>
                      <span className="ml-auto font-semibold text-text">
                        {formatDate ? formatDate(schedule.date) : schedule.date}
                      </span>
                    </div>

                    {/* Day */}
                    <div className="flex items-center gap-3">
                      <FaCalendarCheck className="w-4 shrink-0 text-secondary" />
                      <span className="text-text-muted">Day:</span>
                      <span className="ml-auto font-semibold text-text">
                        {new Date(schedule.date).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-3">
                      <FaClock className="w-4 shrink-0 text-secondary" />
                      <span className="text-text-muted">Time:</span>
                      <span className="ml-auto font-semibold text-text">
                        {schedule.time || "TBD"}
                      </span>
                    </div>

                    {/* Format */}
                    <div className="flex items-center gap-3">
                      <IoFootball className="w-4 shrink-0 text-secondary" />
                      <span className="text-text-muted">Format:</span>
                      <span className="ml-auto font-semibold text-text">
                        {schedule.matchFormat} vs {schedule.matchFormat}
                      </span>
                    </div>
                  </div>

                  {/* ================= ACTION BUTTON ================= */}
                  <Link
                    to={`/upcoming-matches/${match._id}`}
                    className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/60 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 group-hover:gap-3 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:from-[#0E5FD8] group-hover:to-secondary group-hover:shadow-lg group-hover:shadow-[#0E5FD8]/25"
                  >
                    <span>View Match Poster</span>
                    <HiOutlineChevronRight className="text-base transition-transform group-hover:translate-x-1" />
                  </Link>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;

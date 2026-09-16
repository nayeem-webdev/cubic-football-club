import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  MapPin,
  ChevronRight,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const UpcomingMatches = () => {
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

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    return new Date(`${dateString}T00:00:00`).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#07111F] text-[#F8FAFC]">
        <div className="flex items-center gap-3 text-[#B8C2D1]">
          <LoaderCircle className="h-5 w-5 animate-spin text-[#D4AF37]" />
          Loading matches...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07111F] px-4 py-16 text-[#F8FAFC]">
        <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-red-500/30 bg-[#0E1D34] p-8 text-center">
          <AlertCircle className="mb-3 h-8 w-8 text-red-400" />
          <h2 className="text-lg font-semibold">Unable to load matches</h2>
          <p className="mt-2 text-sm text-[#B8C2D1]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-10">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            CUBIC FC
          </p>

          <h1 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">
            Matches
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-[#B8C2D1] sm:text-base">
            Follow upcoming fixtures, friendly matches, and previous games.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#28466B] px-6 py-16 text-center">
            <p className="text-[#B8C2D1]">No matches available.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {matches.map((match) => {
              const schedule = match.matchSchedule || {};
              const homeTeam = match.homeTeam || {};
              const awayTeam = match.awayTeam || {};

              return (
                <Link
                  key={match._id}
                  to={`/upcoming-matches/${match._id}`}
                  className="group overflow-hidden rounded-2xl border border-[#28466B] bg-[#0E1D34] transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/70 hover:shadow-xl hover:shadow-[#000]/20"
                >
                  {/* Card top */}
                  <div className="relative overflow-hidden bg-[#152640] px-5 py-4">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,95,216,0.22),transparent_45%)]" />

                    <div className="relative flex items-center justify-between">
                      <span className="rounded-full border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37]">
                        {schedule.matchType || "Match"}
                      </span>

                      <span className="text-xs font-semibold text-[#B8C2D1]">
                        {schedule.matchFormat
                          ? `${schedule.matchFormat} Aside`
                          : "Football"}
                      </span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="px-5 py-7">
                    <div className="flex items-center justify-between gap-4">
                      {/* Home team */}
                      <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#28466B] bg-[#07111F] p-3">
                          <img
                            src={homeTeam.logoLow}
                            alt={homeTeam.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <h2 className="line-clamp-2 text-sm font-bold text-[#F8FAFC]">
                          {homeTeam.name || "Home Team"}
                        </h2>

                        <span className="mt-1 text-[10px] uppercase tracking-widest text-[#B8C2D1]">
                          Home
                        </span>
                      </div>

                      {/* VS */}
                      <div className="shrink-0 text-center">
                        <span className="text-xl font-black italic text-[#D4AF37]">
                          VS
                        </span>
                      </div>

                      {/* Away team */}
                      <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full border border-[#28466B] bg-[#07111F] p-3">
                          <img
                            src={awayTeam.logoLow}
                            alt={awayTeam.name}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <h2 className="line-clamp-2 text-sm font-bold text-[#F8FAFC]">
                          {awayTeam.name || "Away Team"}
                        </h2>

                        <span className="mt-1 text-[10px] uppercase tracking-widest text-[#B8C2D1]">
                          Away
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Match information */}
                  <div className="border-t border-[#28466B] px-5 py-4">
                    <div className="space-y-3 text-xs text-[#B8C2D1]">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span>{formatDate(schedule.date)}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock3 className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span>{schedule.time || "Time not available"}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                        <span className="truncate">
                          {schedule.venue?.venue || "Venue not available"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-[#28466B] pt-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-accent">
                        View Match Poster
                      </span>

                      <ChevronRight className="h-5 w-5 text-[#D4AF37] transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default UpcomingMatches;

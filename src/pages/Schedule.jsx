import {
  FaCalendar,
  FaCalendarCheck,
  FaClock,
  FaDiamondTurnRight,
} from "react-icons/fa6";
import { IoFootball } from "react-icons/io5";
import PageHero from "../components/PageHero";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

// ========================================
// GET MATCH STATUS

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

export default function Schedule() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // FETCH SCHEDULES
  // ========================================
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/schedules`);

        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }

        const data = await response.json();

        setSchedules(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [API_URL]);

  // ========================================
  // BADGE STYLES
  // ========================================

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        {loading && <Loader />}

        {/* Header */}
        <PageHero
          text="Fixtures"
          heading="Football Turf Schedule"
          subheading="Upcoming and completed football sessions in Chattogram."
        />

        {/* ========================================
          SCHEDULE SECTION
      ======================================== */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((item, index) => {
            const status = getStatus(item.date);

            return (
              <article
                key={item._id || index}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#28466B] bg-[#061834ac] p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#3a82ff54] hover:shadow-2xl"
              >
                {/* Subtle top accent */}
                <div className="absolute left-0 right-0 top-0 h-1 bg-linear-to-r from-primary to-accent" />

                {/* ================= HEADER ================= */}
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    {/* Football Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 text-lg text-accent">
                      <IoFootball />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-base font-bold text-[#F8FAFC] sm:text-lg">
                        {item.venue?.venue || item.venue || "Unknown Venue"}
                      </h3>

                      <p className="mt-0.5 text-xs text-secondary">
                        {item.matchType === "competitive"
                          ? "Competitive Match"
                          : item.matchType === "friendly"
                            ? "Friendly Match"
                            : "Training Match"}{" "}
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
                <div className="mb-5 h-px w-full bg-linear-to-r from-[#28466B] to-transparent" />

                {/* ================= MATCH DETAILS ================= */}
                <div className="mb-6 space-y-3 text-sm">
                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <FaCalendar className="w-4 shrink-0 text-accent" />

                    <span className="text-[#B8C2D1]">Date:</span>

                    <span className="ml-auto font-semibold text-[#F8FAFC]">
                      {new Date(item.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Day */}
                  <div className="flex items-center gap-3">
                    <FaCalendarCheck className="w-4 shrink-0 text-accent" />

                    <span className="text-[#B8C2D1]">Day:</span>

                    <span className="ml-auto font-semibold text-[#F8FAFC]">
                      {new Date(item.date).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-3">
                    <FaClock className="w-4 shrink-0 text-accent" />

                    <span className="text-[#B8C2D1]">Time:</span>

                    <span className="ml-auto font-semibold text-[#F8FAFC]">
                      {item.time}
                    </span>
                  </div>

                  {/* Format */}
                  {item.matchFormat && (
                    <div className="flex items-center gap-3">
                      <IoFootball className="w-4 shrink-0 text-accent" />

                      <span className="text-[#B8C2D1]">Format:</span>

                      <span className="ml-auto font-semibold text-[#F8FAFC]">
                        {item.matchFormat} vs {item.matchFormat}
                      </span>
                    </div>
                  )}
                </div>

                {/* ================= DIRECTION ================= */}
                <a
                  href={item.venue?.direction || item.direction}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-slate-700/60 text-sm font-semibold text-white transition-all duration-300 group-hover:bg-linear-to-r group-hover:from-emerald-600 group-hover:to-indigo-600 group-hover:border-transparent group-hover:gap-3 group-hover:shadow-lg group-hover:shadow-emerald-900/30"
                >
                  <FaDiamondTurnRight className="text-xs" />
                  <span>Get Direction</span>
                </a>
              </article>
            );
          })}
        </div>

        {/* ========================================
            EMPTY STATE
        ======================================== */}
        {!loading && schedules.length === 0 && (
          <div className="rounded-2xl border border-slate-700/40 bg-slate-800/40 p-10 text-center">
            <IoFootball className="mx-auto mb-4 text-4xl text-slate-500" />

            <h3 className="text-lg font-bold text-white">No schedules found</h3>

            <p className="mt-2 text-sm text-slate-400">
              There are currently no football schedules available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

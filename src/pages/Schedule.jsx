import {
  FaCalendar,
  FaCalendarCheck,
  FaClock,
  FaDiamondTurnRight,
  FaShare,
  FaUserGroup,
  FaVolleyball,
} from "react-icons/fa6";
import { IoFootball } from "react-icons/io5";
import PageHero from "../components/PageHero";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import ScheduleCard from "../components/ScheduleCard";

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

  if (matchDate > bangladeshDate) {
    return "upcoming";
  }

  return "completed";
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

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
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
          {schedules.map((schedule) => (
            <ScheduleCard schedule={schedule} key={schedule._id} />
          ))}
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

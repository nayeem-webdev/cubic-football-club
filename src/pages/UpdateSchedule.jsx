import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";
import ModalEditSchedule from "../components/ModalEditSchedule";

const API_URL = import.meta.env.VITE_API_URL;

export default function UpdateSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Selected schedule for modal
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  // ========================================
  // FETCH SCHEDULES
  // ========================================

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/schedules`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch schedules (Status: ${response.status})`,
        );
      }

      const data = await response.json();

      setSchedules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError(
        err.message || "An unexpected error occurred while loading schedules.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSchedules();
  }, []);

  // ========================================
  // AFTER UPDATE
  // ========================================

  const handleScheduleUpdated = (updatedItem, options = {}) => {
    // If the call passed a deleted flag or explicit ID
    if (options.isDeleted || updatedItem?.isDeleted) {
      const deletedId =
        typeof updatedItem === "string" ? updatedItem : updatedItem._id;
      setSchedules((prevSchedules) =>
        prevSchedules.filter((schedule) => schedule._id !== deletedId),
      );
    } else {
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule._id === updatedItem._id ? updatedItem : schedule,
        ),
      );
    }

    setSelectedSchedule(null);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-4xl">
        <PageHero
          text="SCHEDULE CENTER"
          heading="Select a Schedule to Edit"
          subheading="Choose a schedule to update match date, time, venue, format, or type."
        />

        {/* ========================================
            LOADING STATE
        ======================================== */}
        {loading && (
          <div className="my-12 flex justify-center">
            <Loader />
          </div>
        )}

        {/* ========================================
            ERROR STATE
        ======================================== */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            <p className="mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchSchedules}
              className="rounded-lg bg-red-600/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ========================================
            SCHEDULE LIST
        ======================================== */}
        {!loading && !error && (
          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <button
                key={schedule._id}
                type="button"
                aria-label={`Edit schedule for ${schedule.matchType || "match"}`}
                onClick={() => setSelectedSchedule(schedule)}
                className="group w-full rounded-2xl border-2 border-transparent bg-surface/60 text-text-muted p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-border"
              >
                <div className="grid gap-2 md:grid-cols-[1fr_1.2fr] md:items-center">
                  {/* LEFT */}
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      {/* MATCH TYPE BADGE */}
                      <span className="rounded-md bg-secondary/15 px-2 py-1 text-xs font-semibold text-secondary">
                        {schedule.matchType
                          ? schedule.matchType.toUpperCase()
                          : "MATCH"}
                      </span>

                      {/* FORMAT BADGE */}
                      <span className="text-xs text-text-muted">
                        {schedule.matchFormat} V {schedule.matchFormat}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-text sm:text-2xl">
                      {schedule.matchType.charAt(0).toUpperCase() +
                        schedule.matchType.slice(1)}{" "}
                      Match
                    </h2>
                  </div>

                  {/* RIGHT */}
                  <div className="grid grid-cols-3 gap-4 text-sm text-text-muted md:grid-cols-3">
                    {/* DATE */}
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-text-muted">DATE</p>
                      <p className="font-medium text-text">
                        {schedule.date || "N/A"}
                      </p>
                    </div>

                    {/* TIME */}
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-text-muted">TIME</p>
                      <p className="font-medium text-text">
                        {schedule.time || "N/A"}
                      </p>
                    </div>

                    {/* VENUE */}
                    <div className="min-w-0">
                      <p className="mb-1 text-xs text-text-muted">VENUE</p>
                      <p className="font-medium text-text">
                        {typeof schedule.venue === "object"
                          ? schedule.venue?.venue || "N/A"
                          : schedule.venue || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* ========================================
            EMPTY STATE
        ======================================== */}
        {!loading && !error && schedules.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border text-text-muted p-10 text-center">
            <p className="mb-4 text-text-muted">
              No schedules available to edit.
            </p>
          </div>
        )}
      </div>

      {/* ========================================
          EDIT MODAL
      ======================================== */}
      {selectedSchedule && (
        <ModalEditSchedule
          schedule={selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
          onUpdated={handleScheduleUpdated}
        />
      )}
    </div>
  );
}

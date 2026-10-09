import { useEffect, useState } from "react";
import { FaCalendar, FaClock, FaXmark, FaFloppyDisk } from "react-icons/fa6";
import { IoFootball } from "react-icons/io5";

const API_URL = import.meta.env.VITE_API_URL;

const ModalEditSchedule = ({ schedule, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    matchFormat: "",
    matchType: "",
    venue: "",
  });

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD SELECTED SCHEDULE
  // ========================================

  useEffect(() => {
    if (!schedule) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFormData({
      date: schedule.date || "",
      time: schedule.time || "",
      matchFormat: schedule.matchFormat || "",
      matchType: schedule.matchType || "",
      venue: schedule.venue?._id || schedule.venue || "",
    });
  }, [schedule]);

  // ========================================
  // FETCH VENUES
  // ========================================

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        setVenuesLoading(true);

        const response = await fetch(`${API_URL}/venues`);

        if (!response.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await response.json();

        setVenues(
          Array.isArray(data)
            ? data
            : Array.isArray(data.venues)
              ? data.venues
              : [],
        );
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setVenuesLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // UPDATE SCHEDULE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.date ||
      !formData.time ||
      !formData.matchFormat ||
      !formData.matchType ||
      !formData.venue
    ) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/schedules/${schedule._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formData.date,
          time: formData.time,
          matchFormat: formData.matchFormat,
          matchType: formData.matchType,
          venue: formData.venue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update schedule");
      }

      // Send updated schedule back to parent
      if (onUpdated) {
        onUpdated(data.schedule || data);
      }

      onClose();
    } catch (error) {
      console.error("Error updating schedule:", error);
      setError(error.message || "Failed to update schedule.");
    } finally {
      setLoading(false);
    }
  };

  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[#28466B] bg-[#0E1D34] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#28466B] bg-[#0E1D34] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3A82FF]">
              Schedule Center
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#F8FAFC]">
              Edit Schedule
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#28466B] bg-[#07111F] text-[#B8C2D1] transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <FaXmark />
          </button>
        </div>

        {/* ========================================
            FORM
        ======================================== */}

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ========================================
              DATE + TIME
          ======================================== */}

          <div className="grid gap-5 md:grid-cols-2">
            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#B8C2D1]">
                Match Date
              </label>

              <div className="relative">
                <FaCalendar className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#49C85A]" />

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#28466B] bg-[#07111F] px-11 py-3 text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8] focus:ring-2 focus:ring-[#0E5FD8]/20"
                />
              </div>
            </div>

            {/* TIME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#B8C2D1]">
                Match Time
              </label>

              <div className="relative">
                <FaClock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#49C85A]" />

                <input
                  type="text"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="9:00 PM – 10:30 PM"
                  className="w-full rounded-xl border border-[#28466B] bg-[#07111F] px-11 py-3 text-[#F8FAFC] placeholder:text-[#B8C2D1]/40 outline-none transition focus:border-[#0E5FD8] focus:ring-2 focus:ring-[#0E5FD8]/20"
                />
              </div>
            </div>
          </div>

          {/* ========================================
              FORMAT + TYPE
          ======================================== */}

          <div className="grid gap-5 md:grid-cols-2">
            {/* FORMAT */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#B8C2D1]">
                Match Format
              </label>

              <div className="relative">
                <IoFootball className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#49C85A]" />

                <select
                  name="matchFormat"
                  value={formData.matchFormat}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-[#28466B] bg-[#07111F] px-11 py-3 text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8] focus:ring-2 focus:ring-[#0E5FD8]/20"
                >
                  <option value="">Select format</option>
                  <option value="5">5 vs 5</option>
                  <option value="6">6 vs 6</option>
                  <option value="7">7 vs 7</option>
                  <option value="8">8 vs 8</option>
                  <option value="9">9 vs 9</option>
                  <option value="10">10 vs 10</option>
                  <option value="11">11 vs 11</option>
                </select>
              </div>
            </div>

            {/* MATCH TYPE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#B8C2D1]">
                Match Type
              </label>

              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#28466B] bg-[#07111F] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8] focus:ring-2 focus:ring-[#0E5FD8]/20"
              >
                <option value="">Select type</option>
                <option value="training">Training</option>
                <option value="friendly">Friendly</option>
                <option value="competitive">Competitive</option>
              </select>
            </div>
          </div>

          {/* ========================================
              VENUE
          ======================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#B8C2D1]">
              Venue
            </label>

            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              disabled={venuesLoading}
              className="w-full rounded-xl border border-[#28466B] bg-[#07111F] px-4 py-3 text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8] focus:ring-2 focus:ring-[#0E5FD8]/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">
                {venuesLoading ? "Loading venues..." : "Select venue"}
              </option>

              {venues.map((venue) => (
                <option key={venue._id} value={venue._id}>
                  {venue.venue}
                </option>
              ))}
            </select>
          </div>

          {/* ========================================
              CURRENT VENUE
          ======================================== */}

          {schedule.venue?.venue && (
            <div className="rounded-xl border border-[#28466B] bg-[#07111F]/60 px-4 py-3">
              <p className="text-xs uppercase tracking-wider text-[#B8C2D1]/60">
                Current Venue
              </p>

              <p className="mt-1 text-sm font-medium text-[#F8FAFC]">
                {schedule.venue.venue}
              </p>
            </div>
          )}

          {/* ========================================
              ACTIONS
          ======================================== */}

          <div className="flex flex-col-reverse gap-3 border-t border-[#28466B] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-[#28466B] bg-[#07111F] px-5 py-3 font-medium text-[#B8C2D1] transition hover:border-[#3A82FF] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0E5FD8] px-5 py-3 font-semibold text-white transition hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaFloppyDisk />

              {loading ? "Updating..." : "Update Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditSchedule;

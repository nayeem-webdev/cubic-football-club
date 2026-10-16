import { useEffect, useState } from "react";
import { FaXmark, FaFloppyDisk, FaTrash } from "react-icons/fa6";
import TimePicker from "./TimePicker";
import matchFormats from "../constants/matchFormats";
import matchTypes from "../constants/matchTypes";

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
  const [deleting, setDeleting] = useState(false);
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

        const venueList = Array.isArray(data)
          ? data
          : Array.isArray(data.venues)
            ? data.venues
            : [];

        setVenues(venueList);
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

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // UPDATE SCHEDULE
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

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
        method: "PATCH",
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

      if (!response.ok) {
        const responseText = await response.text();

        console.error(`HTTP Status: ${response.status} ${response.statusText}`);

        console.error("Server Response Body:", responseText);

        throw new Error(`Failed to update schedule (${response.status})`);
      }

      const data = await response.json();

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

  // ========================================
  // DELETE SCHEDULE
  // ========================================

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this match? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(`${API_URL}/schedules/${schedule._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");

        let errorMessage = `Failed to delete match (${response.status})`;

        if (contentType?.includes("application/json")) {
          const data = await response.json();

          errorMessage = data.message || errorMessage;
        }

        throw new Error(errorMessage);
      }

      if (onUpdated) {
        onUpdated(schedule._id, {
          isDeleted: true,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error deleting match:", error);

      setError(error.message || "Failed to delete schedule.");
    } finally {
      setDeleting(false);
    }
  };

  if (!schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-border text-text-muted shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* ========================================
            HEADER
        ======================================== */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border text-text-muted px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#3A82FF]">
              Schedule Center
            </p>

            <h2 className="mt-1 text-xl font-bold text-text">Edit Schedule</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-text-muted transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <FaXmark />
          </button>
        </div>

        {/* ========================================
            FORM
        ======================================== */}

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* ERROR */}
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
              <label className="mb-2 block text-sm font-medium text-text">
                Match Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none focus:border-[#0E5FD8]"
              />
            </div>

            {/* TIME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Match Time
              </label>
              <TimePicker
                value={formData.time}
                onChange={(time) =>
                  setFormData((prev) => ({
                    ...prev,
                    time,
                  }))
                }
              />
            </div>
          </div>

          {/* ========================================
              FORMAT + TYPE
          ======================================== */}

          <div className="grid gap-5 md:grid-cols-2">
            {/* MATCH FORMAT */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Match Format
              </label>

              <select
                name="matchFormat"
                value={formData.matchFormat}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none focus:border-[#0E5FD8]"
              >
                <option value="" disabled>
                  Select format
                </option>
                {matchFormats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            {/* MATCH TYPE */}

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Match Type
              </label>

              <select
                name="matchType"
                value={formData.matchType}
                onChange={handleChange}
                className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none focus:border-[#0E5FD8]"
              >
                <option value="">Select type</option>

                {matchTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ========================================
              VENUE
          ======================================== */}

          <div>
            <label className="mb-2 block text-sm font-medium text-text">
              Venue
            </label>

            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              disabled={venuesLoading}
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none focus:border-[#0E5FD8] disabled:cursor-not-allowed disabled:opacity-60"
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
              ACTION BUTTONS
          ======================================== */}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            {/* DELETE */}

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || loading}
              className="order-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:order-1 sm:w-auto"
            >
              <FaTrash className="text-xs" />

              <span>{deleting ? "Deleting Match..." : "Delete Match"}</span>
            </button>

            {/* CANCEL + UPDATE */}

            <div className="order-1 grid w-full grid-cols-2 gap-3 sm:order-2 sm:flex sm:w-auto sm:items-center">
              <button
                type="button"
                onClick={onClose}
                disabled={loading || deleting}
                className="w-full rounded-xl border border-border px-5 py-3 text-sm font-semibold text-text-muted transition hover:border-[#3A82FF] hover:text-white active:scale-[0.98] disabled:opacity-50 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || deleting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3A82FF] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                <FaFloppyDisk className="text-xs" />

                <span>{loading ? "Updating..." : "Update"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditSchedule;

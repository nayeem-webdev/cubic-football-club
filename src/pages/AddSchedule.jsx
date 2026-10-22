import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";
import matchFormats from "../constants/matchFormats";
import matchTypes from "../constants/matchTypes";
import TimePicker from "../components/TimePicker";

const AddSchedule = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  // ========================================
  // SCHEDULE FORM
  // ========================================
  const initialSchedule = {
    venue: "",
    date: "",
    time: "",
    matchFormat: "",
    matchType: "",
  };

  const [formData, setFormData] = useState(initialSchedule);

  // ========================================
  // VENUES
  // ========================================
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(true);

  // ========================================
  // SCHEDULE UI
  // ========================================
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ========================================
  // ADD VENUE UI
  // ========================================
  const [showAddVenue, setShowAddVenue] = useState(false);

  const [venueForm, setVenueForm] = useState({
    venue: "",
    direction: "",
  });

  const [venueLoading, setVenueLoading] = useState(false);
  const [venueMessage, setVenueMessage] = useState("");

  // ========================================
  // GET VENUES
  // ========================================
  const fetchVenues = async () => {
    try {
      setVenuesLoading(true);

      const response = await fetch(`${API_URL}/venues`);
      const data = await response.json();

      console.log("Venues response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch venues");
      }

      setVenues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching venues:", error);

      setVenues([]);
      setMessage(error.message);
    } finally {
      setVenuesLoading(false);
    }
  };

  // ========================================
  // LOAD VENUES
  // ========================================
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchVenues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [API_URL]);

  // ========================================
  // HANDLE SCHEDULE INPUT
  // ========================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // HANDLE VENUE INPUT
  // ========================================
  const handleVenueChange = (e) => {
    const { name, value } = e.target;

    setVenueForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ========================================
  // ADD VENUE
  // ========================================
  const handleAddVenue = async () => {
    // Basic validation
    if (!venueForm.venue.trim()) {
      setVenueMessage("Please enter a venue name.");
      return;
    }

    if (!venueForm.direction.trim()) {
      setVenueMessage("Please enter the Google Maps direction.");
      return;
    }

    setVenueLoading(true);
    setVenueMessage("");

    console.log("Sending venue:", venueForm);

    try {
      const response = await fetch(`${API_URL}/venues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(venueForm),
      });

      const data = await response.json();

      console.log("Venue server response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add venue");
      }

      // ========================================
      // GET CREATED VENUE
      // ========================================
      const newVenue = data.venue;

      if (!newVenue || !newVenue._id) {
        throw new Error(
          "Venue was created, but server did not return the venue data.",
        );
      }

      console.log("New venue:", newVenue);

      // ========================================
      // ADD NEW VENUE TO DROPDOWN
      // ========================================
      setVenues((prev) => [...prev, newVenue]);

      // ========================================
      // AUTOMATICALLY SELECT NEW VENUE
      // ========================================
      setFormData((prev) => ({
        ...prev,
        venue: newVenue._id,
      }));

      // ========================================
      // CLEAR VENUE FORM
      // ========================================
      setVenueForm({
        venue: "",
        direction: "",
      });

      setVenueMessage("Venue added successfully!");

      // ========================================
      // CLOSE ADD VENUE
      // ========================================
      setTimeout(() => {
        setShowAddVenue(false);
        setVenueMessage("");
      }, 1000);
    } catch (error) {
      console.error("Error adding venue:", error);

      setVenueMessage(error.message);
    } finally {
      setVenueLoading(false);
    }
  };

  // ========================================
  // SUBMIT SCHEDULE
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (!formData.venue) {
      setMessage("Please select a venue.");
      setLoading(false);
      return;
    }

    console.log("Sending schedule:", formData);

    try {
      const response = await fetch(`${API_URL}/schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Schedule response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to add schedule");
      }

      setMessage("Schedule added successfully!");

      setFormData(initialSchedule);
    } catch (error) {
      console.error("Error adding schedule:", error);

      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // CLEAR SCHEDULE
  // ========================================
  const handleClear = () => {
    setFormData(initialSchedule);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <PageHero
          text="CUBIC FC"
          heading="Add Schedule"
          subheading="Create a new match schedule for your team."
        />
        {/* ========================================
            SCHEDULE CARD
        ======================================== */}
        <div className="rounded-2xl bg-card text-text p-6 shadow-2xl md:p-8">
          {/* ONLY ONE FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ========================================
                VENUE
            ======================================== */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="venue" className="block mb-2 font-medium">
                  Venue
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setShowAddVenue((prev) => !prev);
                    setVenueMessage("");
                  }}
                  className="text-sm font-semibold text-[#49C85A] transition hover:text-[#6BE878]"
                >
                  {showAddVenue ? "− Cancel" : "+ Add Venue"}
                </button>
              </div>

              {/* VENUE SELECT */}
              <select
                id="venue"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                disabled={venuesLoading}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
              >
                <option value="">
                  {venuesLoading ? "Loading venues..." : "Select Venue"}
                </option>

                {venues.map((venue) => (
                  <option key={venue._id} value={venue._id}>
                    {venue.venue}
                  </option>
                ))}
              </select>

              {!venuesLoading && venues.length === 0 && (
                <p className="mt-2 text-xs text-yellow-400">
                  No venues available. Add a venue below.
                </p>
              )}
            </div>

            {/* ========================================
                ADD VENUE
            ======================================== */}
            {showAddVenue && (
              <div>
                <div className="space-y-5">
                  {/* VENUE NAME */}
                  <div>
                    <label
                      htmlFor="newVenue"
                      className="block mb-2 font-medium"
                    >
                      Venue
                    </label>

                    <input
                      type="text"
                      id="newVenue"
                      name="venue"
                      value={venueForm.venue}
                      onChange={handleVenueChange}
                      placeholder="e.g. Intercity Sports Junction"
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                    />
                  </div>

                  {/* DIRECTION */}
                  <div>
                    <label
                      htmlFor="newDirection"
                      className="block mb-2 font-medium"
                    >
                      Google Maps Direction
                    </label>

                    <input
                      type="url"
                      id="newDirection"
                      name="direction"
                      value={venueForm.direction}
                      onChange={handleVenueChange}
                      placeholder="https://www.google.com/maps/..."
                      required
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                    />

                    <p className="mt-2 text-xs text-text-muted">
                      Paste the Google Maps direction link.
                    </p>
                  </div>

                  {/* ADD VENUE BUTTON */}
                  <button
                    type="button"
                    onClick={handleAddVenue}
                    disabled={venueLoading}
                    className="w-full rounded-xl bg-[#49C85A] px-6 py-3 font-semibold text-[#07111F] transition hover:bg-[#6BE878] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {venueLoading ? "Adding Venue..." : "Add Venue"}
                  </button>
                </div>

                {/* VENUE MESSAGE */}
                {venueMessage && (
                  <div
                    className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                      venueMessage.includes("successfully")
                        ? "border-secondary/30 bg-[#49C85A]/10 text-[#49C85A]"
                        : "border-red-500/30 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {venueMessage}
                  </div>
                )}
              </div>
            )}

            {/* ========================================
                DATE & TIME
            ======================================== */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* DATE */}
              <div>
                <label htmlFor="date" className="block mb-2 font-medium">
                  Match Date
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                />
              </div>

              {/* TIME */}
              <div>
                <label className="block mb-2 font-medium">Match Time</label>
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
                MATCH FORMAT & TYPE
            ======================================== */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* FORMAT */}
              <div>
                <label htmlFor="matchFormat" className="block mb-2 font-medium">
                  Match Format
                </label>

                <select
                  name="matchFormat"
                  value={formData.matchFormat}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
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

              {/* TYPE */}
              <div>
                <label htmlFor="matchType" className="block mb-2 font-medium">
                  Match Type
                </label>

                <select
                  name="matchType"
                  value={formData.matchType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                >
                  <option value="" disabled>
                    Select type
                  </option>

                  {matchTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-border" />

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="rounded-xl border border-border px-6 py-3 font-semibold text-text-muted transition hover:border-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading || venuesLoading || venues.length === 0}
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Adding Schedule..." : "Add Schedule"}
              </button>
            </div>
          </form>

          {/* SCHEDULE MESSAGE */}
          {message && (
            <div
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                message.includes("successfully")
                  ? "border-secondary/30 bg-[#49C85A]/10 text-[#49C85A]"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSchedule;

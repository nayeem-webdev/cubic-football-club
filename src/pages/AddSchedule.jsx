import { useEffect, useState } from "react";

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
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-3xl">
        {/* ========================================
            HEADER
        ======================================== */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            CUBIC FC
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">Add Schedule</h1>

          <p className="mt-2 text-[#B8C2D1]">
            Create a new match schedule for your team.
          </p>
        </div>

        {/* ========================================
            SCHEDULE CARD
        ======================================== */}
        <div className="rounded-2xl border border-[#28466B] bg-[#0E1D34] p-6 shadow-2xl md:p-8">
          {/* ONLY ONE FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ========================================
                VENUE
            ======================================== */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label htmlFor="venue" className="block text-sm font-medium">
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
                className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
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
                      className="mb-2 block text-sm font-medium"
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
                      className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                    />
                  </div>

                  {/* DIRECTION */}
                  <div>
                    <label
                      htmlFor="newDirection"
                      className="mb-2 block text-sm font-medium"
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
                      className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                    />

                    <p className="mt-2 text-xs text-[#B8C2D1]">
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
                        ? "border-[#49C85A]/30 bg-[#49C85A]/10 text-[#49C85A]"
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
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium"
                >
                  Match Date
                </label>

                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                />
              </div>

              {/* TIME */}
              <div>
                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-medium"
                >
                  Match Time
                </label>

                <input
                  type="text"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  placeholder="e.g. 9:00 PM – 10:00 PM"
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                />
              </div>
            </div>

            {/* ========================================
                MATCH FORMAT & TYPE
            ======================================== */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* FORMAT */}
              <div>
                <label
                  htmlFor="matchFormat"
                  className="mb-2 block text-sm font-medium"
                >
                  Match Format
                </label>

                <select
                  id="matchFormat"
                  name="matchFormat"
                  value={formData.matchFormat}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                >
                  <option value="">Select Match Format</option>

                  <option value="4">4 vs 4</option>
                  <option value="5">5 vs 5</option>
                  <option value="6">6 vs 6</option>
                  <option value="7">7 vs 7</option>
                  <option value="8">8 vs 8</option>
                  <option value="9">9 vs 9</option>
                  <option value="10">10 vs 10</option>
                </select>
              </div>

              {/* TYPE */}
              <div>
                <label
                  htmlFor="matchType"
                  className="mb-2 block text-sm font-medium"
                >
                  Match Type
                </label>

                <select
                  id="matchType"
                  name="matchType"
                  value={formData.matchType}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                >
                  <option value="">Select Match Type</option>

                  <option value="training">Training Match</option>

                  <option value="friendly">Friendly Match</option>

                  <option value="competitive">Competitive Match</option>
                </select>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#28466B]" />

            {/* BUTTONS */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="rounded-xl border border-[#28466B] px-6 py-3 font-semibold text-[#B8C2D1] transition hover:border-[#3A82FF] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading || venuesLoading || venues.length === 0}
                className="rounded-xl bg-[#0E5FD8] px-6 py-3 font-semibold text-white transition hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-60"
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
                  ? "border-[#49C85A]/30 bg-[#49C85A]/10 text-[#49C85A]"
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

import { useEffect, useState } from "react";
import Loader from "./Loader";

const AddOpponentPlayer = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [clubs, setClubs] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const photoURL = [
    "https://i.ibb.co.com/4nFyHXn4/placeholder-1.png",
    "https://i.ibb.co.com/S42Q6ZNG/placeholder-2.png",
    "https://i.ibb.co.com/x86ywqf1/placeholder-3.png",
    "https://i.ibb.co.com/rf05fWBX/placeholder-4.png",
    "https://i.ibb.co.com/cKQdSJdV/placeholder-6.png",
    "https://i.ibb.co.com/w5NjSwR/placeholder-7.png",
    "https://i.ibb.co.com/FkM6gH66/placeholder-8.png",
    "https://i.ibb.co.com/Xr8NThW0/placeholder-9.png",
  ];

  const getRandomPhoto = () =>
    photoURL[Math.floor(Math.random() * photoURL.length)];

  const [formData, setFormData] = useState(() => ({
    name: "",
    position: "",
    jerseyNumber: "",
    photo: getRandomPhoto(),
    playsFor: "",
  }));

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      // Always use the goalkeeper placeholder for GK
      const selectedPhoto =
        formData.position?.trim().toUpperCase() === "GK"
          ? "https://i.ibb.co.com/60GrGTTC/placeholder-5.png"
          : getRandomPhoto();

      const response = await fetch(`${API_URL}/opponent-players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jerseyNumber: Number(formData.jerseyNumber),
          photo: selectedPhoto,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register player");
      }

      setMessage("Player registered successfully!");

      // Reset form with a new random placeholder
      setFormData({
        name: "",
        position: "",
        jerseyNumber: "",
        photo: getRandomPhoto(),
        playsFor: "",
      });
    } catch (error) {
      console.error("Error registering player:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch clubs
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/opponent-teams`);

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await response.json();

        setClubs(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setMessage("Failed to load clubs");
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [API_URL]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {loadingTeams && <Loader />}

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Player Name */}
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Player Name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter player name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
          />
        </div>

        {/* Jersey + Position */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Jersey Number */}
          <div>
            <label
              htmlFor="jerseyNumber"
              className="mb-2 block text-sm font-medium"
            >
              Jersey Number
            </label>

            <input
              id="jerseyNumber"
              name="jerseyNumber"
              type="number"
              placeholder="10"
              value={formData.jerseyNumber}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
            />
          </div>

          {/* Position */}
          <div>
            <label
              htmlFor="position"
              className="mb-2 block text-sm font-medium"
            >
              Position
            </label>

            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none focus:border-[#0E5FD8]"
            >
              <option value="">Select position</option>
              <option value="GK">Goalkeeper</option>
              <option value="DF">Defender</option>
              <option value="MF">Midfielder</option>
              <option value="FW">Forward</option>
              <option value="ST">Striker</option>
            </select>
          </div>
        </div>

        {/* Club */}
        <div>
          <label htmlFor="playsFor" className="mb-2 block text-sm font-medium">
            Club
          </label>

          <select
            id="playsFor"
            name="playsFor"
            value={formData.playsFor}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-card px-4 py-3 text-text outline-none focus:border-[#0E5FD8]"
          >
            <option value="">Select club</option>

            {clubs.map((club) => (
              <option key={club._id} value={club._id}>
                {club.name}
              </option>
            ))}
          </select>
        </div>

        {/* Success / Error Message */}
        {message && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              message.includes("successfully")
                ? "border-secondary/30 bg-[#49C85A]/10 text-[#49C85A]"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || loadingTeams}
          className="w-full rounded-lg bg-primary px-5 py-3.5 font-semibold text-white transition hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Registering Player..." : "Register Player"}
        </button>
      </form>
    </>
  );
};

export default AddOpponentPlayer;

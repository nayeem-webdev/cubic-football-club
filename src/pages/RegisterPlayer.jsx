import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const RegisterPlayer = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [clubs, setClubs] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/teams`);

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await response.json();

        setClubs(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoadingTeams(false);
      }
    };

    fetchTeams();
  }, [API_URL]);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    jerseyNumber: "",
    photo: "",
    foot: "Right",
    playsFor: "",
    clubLogo: "",
    dateOfBirth: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://cubic-fc-server.onrender.com/api/players",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            jerseyNumber: Number(formData.jerseyNumber),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register player");
      }

      setMessage("Player registered successfully!");

      setFormData({
        name: "",
        position: "",
        jerseyNumber: "",
        photo: "",
        foot: "Right",
        playsFor: "",
        clubLogo: "",
        dateOfBirth: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-3xl">
        {loadingTeams && <Loader />}

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-secondary">
            CUBIC FC
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">Register Player</h1>

          <p className="mt-2 text-[#B8C2D1]">Add a new player to the squad.</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#28466B] bg-[#0E1D34] p-6 shadow-2xl md:p-8">
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
                className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
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
                  min="1"
                  max="99"
                  placeholder="10"
                  value={formData.jerseyNumber}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
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
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
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

            {/* DOB + Foot */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Date of Birth */}
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="mb-2 block text-sm font-medium"
                >
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                />
              </div>

              {/* Foot */}
              <div>
                <label
                  htmlFor="foot"
                  className="mb-2 block text-sm font-medium"
                >
                  Preferred Foot
                </label>

                <select
                  id="foot"
                  name="foot"
                  value={formData.foot}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <div>
                <label
                  htmlFor="photo"
                  className="mb-2 block text-sm font-medium"
                >
                  Player Photo URL
                </label>

                <input
                  id="photo"
                  name="photo"
                  type="url"
                  placeholder="https://example.com/player.jpg"
                  value={formData.photo}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none placeholder:text-[#718096] focus:border-[#0E5FD8]"
                />

                <p className="mt-2 text-xs text-[#B8C2D1]">
                  Paste a publicly accessible image URL.
                </p>
              </div>
              <div>
                <label
                  htmlFor="playsFor"
                  className="mb-2 block text-sm font-medium"
                >
                  Club
                </label>

                <select
                  id="playsFor"
                  name="playsFor"
                  value={formData.playsFor}
                  onChange={(e) => {
                    const selectedClub = clubs.find(
                      (club) => club.name === e.target.value,
                    );

                    setFormData((prev) => ({
                      ...prev,
                      playsFor: selectedClub?.name || "",
                      clubLogo: selectedClub?.logoLow || "",
                    }));
                  }}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="">Select club</option>

                  {clubs.map((club) => (
                    <option key={club.name} value={club.name}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Success / Error */}
            {message && (
              <div
                className={`rounded-lg border px-4 py-3 text-sm ${
                  message.includes("successfully")
                    ? "border-[#49C85A]/30 bg-[#49C85A]/10 text-[#49C85A]"
                    : "border-red-500/30 bg-red-500/10 text-red-400"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#0E5FD8] px-5 py-3.5 font-semibold text-white transition hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Registering Player..." : "Register Player"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPlayer;

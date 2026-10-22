import { useState } from "react";

const AddOpponentTeam = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    logoHigh: "",
    logoLow: "",
    shortForm: "",
    captain: "",
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
      const response = await fetch(`${API_URL}/opponent-teams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to register team");
      }

      console.log("Team registered:", data);

      setMessage("Team registered successfully!");

      setFormData({
        name: "",
        logoHigh: "",
        logoLow: "",
        shortForm: "",
        captain: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Team Name */}
      <div>
        <label className="block mb-2 font-medium">Team Name</label>

        <input
          type="text"
          name="name"
          placeholder="Enter team name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
        />
      </div>

      {/* Short Form */}
      <div>
        <label className="block mb-2 font-medium">Short Form</label>

        <input
          type="text"
          name="shortForm"
          placeholder="Example: CFC"
          value={formData.shortForm}
          onChange={handleChange}
          maxLength="5"
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
        />
      </div>

      {/* Logo URLs */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="block mb-2 font-medium">Logo High URL</label>

          <input
            type="url"
            name="logoHigh"
            placeholder="https://example.com/logo 640*640.png"
            value={formData.logoHigh}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Logo Low URL</label>

          <input
            type="url"
            name="logoLow"
            placeholder="https://example.com/logo 200*200.png"
            value={formData.logoLow}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
          />
        </div>
      </div>

      {/* Captain ID */}
      <div>
        <label className="block mb-2 font-medium">Captain ID</label>

        <input
          type="text"
          name="captain"
          placeholder="Enter captain ID"
          value={formData.captain}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
        />
      </div>

      {/* Message */}
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
        disabled={loading}
        className="w-full rounded-lg bg-primary px-5 py-3.5 font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Registering Team..." : "Register Team"}
      </button>
    </form>
  );
};

export default AddOpponentTeam;

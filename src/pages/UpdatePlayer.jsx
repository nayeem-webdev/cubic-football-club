import { useEffect, useState } from "react";
import { Edit3, Save, X } from "lucide-react";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

export default function UpdatePlayer() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Fetch players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/players`);

        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }

        const data = await response.json();

        setPlayers(data);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [API_URL]);

  // Fetch clubs
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
      }
    };

    fetchTeams();
  }, [API_URL]);

  // Start editing
  const handleEdit = (player) => {
    setEditingId(player._id);

    setFormData({
      name: player.name || "",
      jerseyNumber: player.jerseyNumber ?? "",
      position: player.position || "",
      dateOfBirth: player.dateOfBirth
        ? new Date(player.dateOfBirth).toISOString().split("T")[0]
        : "",
      foot: player.foot || "",

      // Supports both:
      // playsFor: "66abc123..."
      // playsFor: { _id: "66abc123...", name: "Cubic FC" }
      playsFor:
        typeof player.playsFor === "object"
          ? player.playsFor?._id || ""
          : player.playsFor || "",

      photo: player.photo || "",
    });
  };

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  // Update player
  const handleUpdate = async (playerId) => {
    try {
      const response = await fetch(`${API_URL}/players/${playerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          jerseyNumber: Number(formData.jerseyNumber),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        throw new Error(data.error || "Failed to update player");
      }

      const updatedPlayer = await response.json();

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === playerId ? updatedPlayer : player,
        ),
      );

      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error("Error updating player:", error);
      alert(error.message);
    }
  };

  // Get club name
  const getClubName = (playsFor) => {
    if (!playsFor) return "-";

    // If populated
    if (typeof playsFor === "object") {
      return playsFor.name || "-";
    }

    // If only ObjectId
    const club = clubs.find((club) => club._id === playsFor);

    return club?.name || playsFor;
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="Cubic FC"
          heading="Update Players"
          subheading="Manage and update player information."
        />

        <div
          className="overflow-x-auto rounded-xl"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <table className="w-full min-w-287.5 text-sm">
            <thead
              className="text-[11px] uppercase tracking-wider"
              style={{
                background: "var(--color-card)",
                color: "var(--color-text-muted)",
              }}
            >
              <tr>
                <th className="px-4 py-3 text-left font-medium">Player</th>

                <th className="px-3 py-3 text-left font-medium">No.</th>

                <th className="px-3 py-3 text-left font-medium">Position</th>

                <th className="px-3 py-3 text-left font-medium">DOB</th>

                <th className="px-3 py-3 text-left font-medium">Foot</th>

                <th className="px-3 py-3 text-left font-medium">Club</th>

                <th className="px-3 py-3 text-left font-medium">Image URL</th>

                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {players.map((player) => {
                const isEditing = editingId === player._id;

                return (
                  <tr
                    key={player._id}
                    className="transition-colors hover:bg-white/2"
                    style={{
                      borderTop: "1px solid var(--color-border)",
                    }}
                  >
                    {/* Player */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full">
                          <img
                            src={
                              isEditing
                                ? formData.photo || player.photo
                                : player.photo
                            }
                            alt={player.name}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-40 rounded-md px-2.5 py-1.5 text-sm outline-none"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          />
                        ) : (
                          <span className="whitespace-nowrap font-medium">
                            {player.name}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Number */}
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <input
                          type="number"
                          name="jerseyNumber"
                          value={formData.jerseyNumber}
                          onChange={handleChange}
                          className="w-14 rounded-md px-2 py-1.5 text-center outline-none"
                          style={{
                            background: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      ) : (
                        <span className="font-medium">
                          {player.jerseyNumber}
                        </span>
                      )}
                    </td>

                    {/* Position */}
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <select
                          name="position"
                          value={formData.position}
                          onChange={handleChange}
                          className="rounded-md px-2 py-1.5 text-xs outline-none"
                          style={{
                            background: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <option value="">Select</option>
                          <option value="GK">GK</option>
                          <option value="DF">DF</option>
                          <option value="MF">MF</option>
                          <option value="FW">FW</option>
                          <option value="ST">ST</option>
                        </select>
                      ) : (
                        <span
                          className="rounded-md px-2 py-1 text-xs font-medium"
                          style={{
                            background: "var(--color-card)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          {player.position}
                        </span>
                      )}
                    </td>

                    {/* DOB */}
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="rounded-md px-2 py-1.5 text-xs outline-none"
                          style={{
                            background: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      ) : (
                        <span className="whitespace-nowrap text-xs text-text-muted">
                          {player.dateOfBirth
                            ? new Date(player.dateOfBirth).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "-"}
                        </span>
                      )}
                    </td>

                    {/* Foot */}
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <select
                          name="foot"
                          value={formData.foot}
                          onChange={handleChange}
                          className="rounded-md px-2 py-1.5 text-xs outline-none"
                          style={{
                            background: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <option value="Right">Right</option>
                          <option value="Left">Left</option>
                          <option value="Both">Both</option>
                        </select>
                      ) : (
                        <span className="text-xs">{player.foot}</span>
                      )}
                    </td>

                    {/* Club */}
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <select
                          name="playsFor"
                          value={formData.playsFor}
                          onChange={handleChange}
                          className="w-36 rounded-md px-2 py-1.5 text-xs outline-none"
                          style={{
                            background: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          <option value="">Select club</option>

                          {clubs.map((club) => (
                            <option key={club._id} value={club._id}>
                              {club.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="whitespace-nowrap text-xs">
                          {getClubName(player.playsFor)}
                        </span>
                      )}
                    </td>

                    {/* Image URL */}
                    <td className="px-3 py-3">
                      {isEditing ? (
                        <input
                          type="url"
                          name="photo"
                          value={formData.photo}
                          onChange={handleChange}
                          placeholder="Image URL"
                          className="w-48 rounded-md px-2.5 py-1.5 text-xs outline-none"
                          style={{
                            background: "var(--color-background)",
                            border: "1px solid var(--color-border)",
                          }}
                        />
                      ) : (
                        <span className="block max-w-40 truncate text-xs text-text-muted">
                          {player.photo || "-"}
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => handleUpdate(player._id)}
                              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition hover:opacity-90"
                              style={{
                                background: "var(--color-primary)",
                                color: "#fff",
                              }}
                            >
                              <Save size={14} />
                              Save
                            </button>

                            <button
                              type="button"
                              onClick={handleCancel}
                              className="flex h-8 w-8 items-center justify-center rounded-md transition hover:opacity-80"
                              style={{
                                background: "var(--color-card)",
                                border: "1px solid var(--color-border)",
                              }}
                            >
                              <X size={15} />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEdit(player)}
                            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                            style={{
                              background: "var(--color-card)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <Edit3 size={14} />
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

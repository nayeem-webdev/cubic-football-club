import { useEffect, useState } from "react";
import { Edit3, Save, Trash, X, Search } from "lucide-react";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

const API_URL = import.meta.env.VITE_API_URL;

const POSITION_OPTIONS = [
  { label: "Goalkeeper (GK)", value: "GK" },
  { label: "Defender (DF)", value: "DF" },
  { label: "Midfielder (MF)", value: "MF" },
  { label: "Forward (FW)", value: "FW" },
  { label: "Striker (ST)", value: "ST" },
];

export default function UpdateOpponentPlayer() {
  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [sortBy, setSortBy] = useState("jerseyNumber");

  // Fetch opponent players and opponent teams
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [playersResponse, teamsResponse] = await Promise.all([
          fetch(`${API_URL}/opponent-players`),
          fetch(`${API_URL}/opponent-teams`),
        ]);

        if (!playersResponse.ok) {
          throw new Error("Failed to fetch opponent players.");
        }

        if (!teamsResponse.ok) {
          throw new Error("Failed to fetch opponent teams.");
        }

        const [playersData, teamsData] = await Promise.all([
          playersResponse.json(),
          teamsResponse.json(),
        ]);

        setPlayers(
          Array.isArray(playersData) ? playersData : playersData.players || [],
        );

        setClubs(Array.isArray(teamsData) ? teamsData : teamsData.teams || []);
      } catch (err) {
        console.error("Error fetching opponent player data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get opponent team ID
  const getClubId = (playsFor) => {
    if (!playsFor) return "";

    return typeof playsFor === "object" ? playsFor._id || "" : playsFor;
  };

  // Get opponent team name
  const getClubName = (playsFor) => {
    if (!playsFor) return "-";

    if (typeof playsFor === "object") {
      return playsFor.name || "-";
    }

    const club = clubs.find((item) => item._id === playsFor);

    return club?.name || "-";
  };

  // Start editing
  const handleEdit = (player) => {
    setEditingId(player._id);

    setFormData({
      name: player.name || "",
      jerseyNumber: player.jerseyNumber ?? "",
      position: player.position || "",
      playsFor: getClubId(player.playsFor),
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

  // Update opponent player
  const handleUpdate = async (playerId) => {
    if (
      !formData.name.trim() ||
      !formData.position ||
      formData.jerseyNumber === "" ||
      !formData.playsFor
    ) {
      return;
    }

    const jerseyNumber = Number(formData.jerseyNumber);

    if (!Number.isInteger(jerseyNumber) || jerseyNumber < 0) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/opponent-players/${playerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          jerseyNumber,
          position: formData.position,
          playsFor: formData.playsFor,
          photo: formData.photo.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to update opponent player.",
        );
      }

      const updatedPlayer = data.player || data;

      // Preserve the populated team name when the API
      // returns playsFor as an unpopulated ObjectId.
      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === playerId
            ? {
                ...player,
                ...updatedPlayer,
                playsFor:
                  updatedPlayer.playsFor &&
                  typeof updatedPlayer.playsFor === "object"
                    ? updatedPlayer.playsFor
                    : clubs.find(
                        (club) =>
                          club._id ===
                          (updatedPlayer.playsFor || formData.playsFor),
                      ) || formData.playsFor,
              }
            : player,
        ),
      );

      setEditingId(null);
      setFormData({});
      alert("Opponent player updated successfully.");
    } catch (err) {
      console.error("Error updating opponent player:", err);
    } finally {
      setSaving(false);
    }
  };

  // Delete opponent player
  const handleDelete = async (player) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${player.name}?`,
    );

    if (!confirmed) return;

    setDeletingId(player._id);

    try {
      const response = await fetch(
        `${API_URL}/opponent-players/${player._id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to delete opponent player.",
        );
      }

      setPlayers((prevPlayers) =>
        prevPlayers.filter((item) => item._id !== player._id),
      );

      if (editingId === player._id) {
        setEditingId(null);
        setFormData({});
      }

      alert(data.message || "Opponent player deleted successfully.");
    } catch (err) {
      console.error("Error deleting opponent player:", err);
    } finally {
      setDeletingId(null);
    }
  };

  // Filter and sort players
  const filteredAndSortedPlayers = players
    .filter((player) => {
      const matchesSearch = (player.name || "")
        .toLowerCase()
        .includes(searchTerm.trim().toLowerCase());

      const matchesClub =
        selectedClub === "all" || getClubId(player.playsFor) === selectedClub;

      const matchesPosition =
        selectedPosition === "all" || player.position === selectedPosition;

      return matchesSearch && matchesClub && matchesPosition;
    })
    .sort((a, b) => {
      if (sortBy === "jerseyNumber") {
        const numA = a.jerseyNumber != null ? Number(a.jerseyNumber) : Infinity;

        const numB = b.jerseyNumber != null ? Number(b.jerseyNumber) : Infinity;

        return numA - numB;
      }

      if (sortBy === "nameAsc") {
        return (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        });
      }

      if (sortBy === "nameDesc") {
        return (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
        });
      }

      return 0;
    });

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="Cubic FC"
          heading="Update Opponent Players"
          subheading="Manage player information for opposing clubs."
        />

        {/* Filter Panel */}
        <div className="space-y-4 rounded-xl border border-border text-text-muted p-4 mb-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              />

              <input
                type="text"
                placeholder="Search opponent player..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-9 text-xs text-white outline-none placeholder:text-text-muted focus:border-[#0E5FD8]"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Opponent Team Filter */}
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-muted outline-none focus:border-[#0E5FD8]"
            >
              <option value="all">All Opponent Teams</option>

              {clubs.map((club) => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>

            {/* Position Filter */}
            <select
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-muted outline-none focus:border-[#0E5FD8]"
            >
              <option value="all">All Positions</option>

              {POSITION_OPTIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-text-muted outline-none focus:border-[#0E5FD8]"
            >
              <option value="jerseyNumber">Sort by Jersey No.</option>
              <option value="nameAsc">Sort by Name (A-Z)</option>
              <option value="nameDesc">Sort by Name (Z-A)</option>
              <option value="none">Default Order</option>
            </select>
          </div>
        </div>

        {/* Players Table */}
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <table className="w-full min-w-212.5 text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-text-muted bg-card">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Player</th>
                <th className="px-3 py-3 text-left font-medium">No.</th>
                <th className="px-3 py-3 text-left font-medium">Position</th>
                <th className="px-3 py-3 text-left font-medium">
                  Opponent Team
                </th>
                <th className="px-3 py-3 text-left font-medium">Photo</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-sm text-text-muted"
                  >
                    No opponent players found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredAndSortedPlayers.map((player) => {
                  const isEditing = editingId === player._id;

                  return (
                    <tr
                      key={player._id}
                      className="transition-colors hover:bg-white/5"
                      style={{
                        borderTop: "1px solid var(--color-border)",
                      }}
                    >
                      {/* Player Name and Avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background">
                            {(isEditing ? formData.photo : player.photo) ? (
                              <img
                                src={isEditing ? formData.photo : player.photo}
                                alt={player.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-sm font-semibold text-text-muted">
                                {(player.name || "?").charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {isEditing ? (
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              className="w-36 rounded-md px-2.5 py-1.5 text-xs text-white outline-none"
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

                      {/* Jersey Number */}
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            name="jerseyNumber"
                            min="0"
                            step="1"
                            value={formData.jerseyNumber}
                            onChange={handleChange}
                            required
                            className="w-16 rounded-md px-2 py-1.5 text-center text-xs text-white outline-none"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          />
                        ) : (
                          <span className="font-medium">
                            {player.jerseyNumber ?? "-"}
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
                            required
                            className="rounded-md px-2 py-1.5 text-xs text-white outline-none"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <option value="">Select</option>

                            {POSITION_OPTIONS.map((position) => (
                              <option
                                key={position.value}
                                value={position.value}
                              >
                                {position.value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span
                            className="rounded-md px-2 py-1 text-xs font-medium"
                            style={{
                              background: "var(--color-card)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            {player.position || "-"}
                          </span>
                        )}
                      </td>

                      {/* Opponent Team */}
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <select
                            name="playsFor"
                            value={formData.playsFor}
                            onChange={handleChange}
                            required
                            className="w-36 rounded-md px-2 py-1.5 text-xs text-white outline-none"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <option value="">Select opponent team</option>

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

                      {/* Photo URL */}
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <input
                            type="url"
                            name="photo"
                            value={formData.photo}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-40 rounded-md px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#0E5FD8]"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          />
                        ) : player.photo ? (
                          <a
                            href={player.photo}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-[#60A5FA] hover:underline"
                          >
                            View photo
                          </a>
                        ) : (
                          <span className="text-xs text-text-muted">
                            No photo
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleUpdate(player._id)}
                                disabled={saving}
                                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                                style={{
                                  background: "var(--color-primary)",
                                }}
                              >
                                <Save size={14} />
                                {saving ? "Saving..." : "Save"}
                              </button>

                              <button
                                type="button"
                                onClick={handleCancel}
                                disabled={saving}
                                title="Cancel editing"
                                className="flex h-8 w-8 items-center justify-center rounded-md transition hover:opacity-80 disabled:opacity-50"
                                style={{
                                  background: "var(--color-card)",
                                  border: "1px solid var(--color-border)",
                                }}
                              >
                                <X size={15} />
                              </button>
                            </>
                          ) : (
                            <>
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

                              <button
                                type="button"
                                onClick={() => handleDelete(player)}
                                disabled={deletingId === player._id}
                                title="Delete opponent player"
                                className="flex h-8 w-8 items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                              >
                                <Trash size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

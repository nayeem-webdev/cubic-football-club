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

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [sortBy, setSortBy] = useState("nameAsc");

  // Fetch players
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/players`);
        if (!response.ok) throw new Error("Failed to fetch players");

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
        if (!response.ok) throw new Error("Failed to fetch teams");

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
      status: player.status || "active",
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
    if (typeof playsFor === "object") {
      return playsFor.name || "-";
    }
    const club = clubs.find((c) => c._id === playsFor);
    return club?.name || playsFor;
  };

  // 1. Updated State (Default to 'jerseyNumber' or 'nameAsc')

  // 2. Updated Filter & Sort Pipeline
  const filteredAndSortedPlayers = players
    .filter((player) => {
      const matchesSearch = (player.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const playerClubId =
        typeof player.playsFor === "object"
          ? player.playsFor?._id
          : player.playsFor;
      const matchesClub =
        selectedClub === "all" || playerClubId === selectedClub;

      const matchesPosition =
        selectedPosition === "all" || player.position === selectedPosition;

      const matchesStatus =
        selectedStatus === "all" ||
        (player.status || "active") === selectedStatus;

      return matchesSearch && matchesClub && matchesPosition && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "jerseyNumber") {
        const numA = a.jerseyNumber != null ? Number(a.jerseyNumber) : 999;
        const numB = b.jerseyNumber != null ? Number(b.jerseyNumber) : 999;
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

  const getOutcomeStyles = (type) => {
    switch (type) {
      case "P":
        return {
          bg: "rgba(34,197,94,0.14)",
          border: "rgba(34,197,94,0.30)",
          text: "#22c55e",
        };
      case "A":
        return {
          bg: "rgba(239,68,68,0.14)",
          border: "rgba(239,68,68,0.30)",
          text: "#ef4444",
        };
      default:
        return {
          bg: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.10)",
          text: "var(--color-text-muted)",
        };
    }
  };

  const getStatusBadgeClass = (status = "active") => {
    switch (status) {
      case "active":
        return "border-[#49C85A]/30 bg-[#49C85A]/10 text-[#49C85A]";
      case "inactive":
        return "border-red-500/30 bg-red-500/10 text-red-400";
      case "retired":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
      default:
        return "border-gray-500/30 bg-gray-500/10 text-gray-400";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHero
          text="Cubic FC"
          heading="Update Players"
          subheading="Manage and update player information."
        />

        {/* Filter Panel */}
        <div className="space-y-4 rounded-xl border border-[#28466B] bg-[#0E1D34] p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3.5 py-2 text-xs text-white placeholder-[#718096] outline-none focus:border-[#0E5FD8]"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#718096] hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Team / Club Filter */}
            <div>
              <select
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
                className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2 text-xs text-[#B8C2D1] outline-none focus:border-[#0E5FD8]"
              >
                <option value="all">All Teams</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-row gap-2">
              {/* Position Filter */}
              <div>
                <select
                  value={selectedPosition}
                  onChange={(e) => setSelectedPosition(e.target.value)}
                  className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2 text-xs text-[#B8C2D1] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="all">All Positions</option>
                  <option value="GK">Goalkeeper (GK)</option>
                  <option value="DF">Defender (DF)</option>
                  <option value="MF">Midfielder (MF)</option>
                  <option value="FW">Forward (FW)</option>
                  <option value="ST">Striker (ST)</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2 text-xs text-[#B8C2D1] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="jerseyNumber">Sort by Jersey No.</option>
                  <option value="nameAsc">Sort by Name (A-Z)</option>
                  <option value="nameDesc">Sort by Name (Z-A)</option>
                  <option value="none">Default Order</option>
                </select>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="grid grid-cols-4 gap-2 overflow-x-auto">
              {[
                { label: "All", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Retired", value: "retired" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`whitespace-nowrap rounded-md px-3 py-1 text-xs font-semibold transition ${
                    selectedStatus === tab.value
                      ? "bg-[#0E5FD8] text-white"
                      : "border border-[#28466B] bg-[#07111F] text-[#B8C2D1] hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Player Table */}
        <div
          className="overflow-x-auto rounded-xl"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <table className="w-full min-w-225 text-sm">
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
                <th className="px-3 py-3 text-left font-medium">Status</th>
                <th className="px-3 py-3 text-left font-medium">DOB</th>
                <th className="px-3 py-3 text-left font-medium">Foot</th>
                <th className="px-3 py-3 text-left font-medium">Club</th>
                <th className="px-3 py-3 text-left font-medium">
                  Form / Photo
                </th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredAndSortedPlayers.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="py-8 text-center text-sm text-[#718096]"
                  >
                    No players found matching the selected filters.
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
                      {/* Name & Avatar */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#28466B]">
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
                              className="w-36 rounded-md px-2.5 py-1.5 text-xs outline-none"
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
                            value={formData.jerseyNumber}
                            onChange={handleChange}
                            className="w-14 rounded-md px-2 py-1.5 text-center text-xs outline-none"
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
                            {player.position || "-"}
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="rounded-md px-2 py-1.5 text-xs font-medium outline-none"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="retired">Retired</option>
                          </select>
                        ) : (
                          <span
                            className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${getStatusBadgeClass(
                              player.status,
                            )}`}
                          >
                            {player.status || "active"}
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
                          <span className="whitespace-nowrap text-xs text-[#718096]">
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
                          <span className="text-xs">{player.foot || "-"}</span>
                        )}
                      </td>

                      {/* Club */}
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <select
                            name="playsFor"
                            value={formData.playsFor}
                            onChange={handleChange}
                            className="w-32 rounded-md px-2 py-1.5 text-xs outline-none"
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

                      {/* Form (Display) / Photo Input (Editing) */}
                      <td className="px-3 py-3">
                        {isEditing ? (
                          <input
                            type="url"
                            name="photo"
                            value={formData.photo}
                            onChange={handleChange}
                            placeholder="Image URL"
                            className="w-40 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-[#0E5FD8]"
                            style={{
                              background: "var(--color-background)",
                              border: "1px solid var(--color-border)",
                            }}
                          />
                        ) : (
                          <div className="flex gap-1">
                            {Array.isArray(player.stats?.participatedLast5) &&
                            player.stats.participatedLast5.length > 0 ? (
                              player.stats.participatedLast5.map(
                                (result, index) => {
                                  const style = getOutcomeStyles(result);
                                  return (
                                    <span
                                      key={`${result}-${index}`}
                                      className="flex h-5 w-5 items-center justify-center rounded-md text-[9px] font-bold"
                                      style={{
                                        background: style.bg,
                                        border: `1px solid ${style.border}`,
                                        color: style.text,
                                      }}
                                    >
                                      {result}
                                    </span>
                                  );
                                },
                              )
                            ) : (
                              <span
                                className="text-[10px]"
                                style={{ color: "var(--color-text-muted)" }}
                              >
                                No matches
                              </span>
                            )}
                          </div>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import PlayerManagementCard from "../components/PlayerManagementCard";
import ModalEditPlayer from "../components/ModalEditPlayer";

export default function UpdatePlayer() {
  const API_URL = import.meta.env.VITE_API_URL;

  // ============================================================
  // DATA
  // ============================================================

  const [clubs, setClubs] = useState([]);
  const [players, setPlayers] = useState([]);

  // ============================================================
  // UI STATE
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingPlayer, setEditingPlayer] = useState(null);
  const [formData, setFormData] = useState({});

  // ============================================================
  // FILTER STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [sortBy, setSortBy] = useState("nameAsc");

  // ============================================================
  // FETCH PLAYERS
  // ============================================================

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/player-details`);

        if (!response.ok) {
          throw new Error("Failed to fetch players");
        }

        const data = await response.json();

        setPlayers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching players:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [API_URL]);

  // ============================================================
  // FETCH CLUBS
  // ============================================================

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${API_URL}/teams`);

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await response.json();

        setClubs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [API_URL]);

  // ============================================================
  // OPEN EDIT MODAL
  // ============================================================

  const handleEdit = (player) => {
    setEditingPlayer(player);

    setFormData({
      name: player?.name || "",

      jerseyNumber: player?.jerseyNumber ?? "",

      position: player?.position || "",

      dateOfBirth: player?.dateOfBirth
        ? new Date(player.dateOfBirth).toISOString().split("T")[0]
        : "",

      foot: player?.foot || "",

      status: player?.status || "active",

      playsFor:
        typeof player?.playsFor === "object"
          ? player?.playsFor?._id || ""
          : player?.playsFor || "",

      photo: player?.photo || "",
    });
  };

  // ============================================================
  // FORM CHANGE
  // ============================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCancel = () => {
    if (saving || deleting) return;

    setEditingPlayer(null);
    setFormData({});
  };

  // ============================================================
  // UPDATE PLAYER
  // ============================================================

  const handleUpdate = async () => {
    if (!editingPlayer?._id) return;

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/players/${editingPlayer._id}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...formData,

          jerseyNumber: Number(formData.jerseyNumber),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "Failed to update player",
        );
      }

      const updatedPlayer = data;

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) =>
          player._id === editingPlayer._id ? updatedPlayer : player,
        ),
      );

      setEditingPlayer(null);
      setFormData({});
    } catch (error) {
      console.error("Error updating player:", error);

      alert(error.message);
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // DELETE PLAYER
  // ============================================================

  const deletePlayerById = async () => {
    if (!editingPlayer?._id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${editingPlayer.name || "this player"}?`,
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      const response = await fetch(`${API_URL}/players/${editingPlayer._id}`, {
        method: "DELETE",
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || result.error || "Failed to delete player",
        );
      }

      // Remove immediately from UI
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => player._id !== editingPlayer._id),
      );

      // Close modal
      setEditingPlayer(null);
      setFormData({});

      alert(result.message || "Player deleted successfully.");
    } catch (error) {
      console.error("Delete player error:", error);

      alert(error.message);
    } finally {
      setDeleting(false);
    }
  };

  // ============================================================
  // FILTER + SORT
  // ============================================================

  const filteredAndSortedPlayers = players
    .filter((player) => {
      // SEARCH
      const matchesSearch = (player?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // CLUB
      const playerClubId =
        typeof player?.playsFor === "object"
          ? player?.playsFor?._id
          : player?.playsFor;

      const matchesClub =
        selectedClub === "all" || String(playerClubId) === String(selectedClub);

      // POSITION
      const matchesPosition =
        selectedPosition === "all" || player?.position === selectedPosition;

      // STATUS
      const matchesStatus =
        selectedStatus === "all" ||
        (player?.status || "active") === selectedStatus;

      return matchesSearch && matchesClub && matchesPosition && matchesStatus;
    })
    .sort((a, b) => {
      // JERSEY NUMBER
      if (sortBy === "jerseyNumber") {
        const numA = a?.jerseyNumber != null ? Number(a.jerseyNumber) : 999;

        const numB = b?.jerseyNumber != null ? Number(b.jerseyNumber) : 999;

        return numA - numB;
      }

      // NAME A-Z
      if (sortBy === "nameAsc") {
        return (a?.name || "").localeCompare(b?.name || "", undefined, {
          sensitivity: "base",
        });
      }

      // NAME Z-A
      if (sortBy === "nameDesc") {
        return (b?.name || "").localeCompare(a?.name || "", undefined, {
          sensitivity: "base",
        });
      }

      return 0;
    });

  // ============================================================
  // RESET FILTERS
  // ============================================================

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedClub("all");
    setSelectedPosition("all");
    setSelectedStatus("active");
    setSortBy("nameAsc");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedClub !== "all" ||
    selectedPosition !== "all" ||
    selectedStatus !== "active" ||
    sortBy !== "nameAsc";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-background px-4 py-8 text-text sm:py-10">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ======================================================
            LOADER
        ======================================================= */}

        {loading && <Loader />}

        {/* ======================================================
            HERO
        ======================================================= */}

        <PageHero
          text="CUBIC FC"
          heading="Update Players"
          subheading="Manage and update player information."
        />

        {/* ======================================================
            FILTER PANEL
        ======================================================= */}

        {/* Filter Panel */}
        <div className="space-y-4 rounded-xl bg-card text-text-muted p-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-5">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by player name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3.5 text-xs text-white placeholder-text-muted w-full rounded-lg py-3  pr-3 outline-none bg-background border border-border"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-white"
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
                className="px-3.5 text-xs text-white placeholder-text-muted w-full rounded-lg py-3  pr-3 outline-none bg-background border border-border"
              >
                <option value="all">All Teams</option>
                {clubs.map((club) => (
                  <option key={club._id} value={club._id}>
                    {club.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Position Filter */}
            <div>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="px-3.5 text-xs text-white placeholder-text-muted w-full rounded-lg py-3  pr-3 outline-none bg-background border border-border"
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
                className="px-3.5 text-xs text-white placeholder-text-muted w-full rounded-lg py-3  pr-3 outline-none bg-background border border-border"
              >
                <option value="jerseyNumber">Sort by Jersey No.</option>
                <option value="nameAsc">Sort by Name (A-Z)</option>
                <option value="nameDesc">Sort by Name (Z-A)</option>
                <option value="none">Default Order</option>
              </select>
            </div>

            {/* Status Filter Tabs */}
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3.5 text-xs text-white placeholder-text-muted w-full rounded-lg py-3  pr-3 outline-none bg-background border border-border"
              >
                {[
                  { label: "All Players", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                  { label: "Retired", value: "retired" },
                  { label: "Backup", value: "backup" },
                ].map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    className="bg-background text-text"
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* ======================================================
            PLAYER CARDS
        ======================================================= */}

        {filteredAndSortedPlayers.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-2xl">
              ⚽
            </div>

            <h3 className="text-sm font-bold text-text">No players found</h3>

            <p className="mt-1 text-xs text-text-muted">
              No players match the selected filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-primary-hover"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredAndSortedPlayers.map((player) => (
              <PlayerManagementCard
                key={player._id}
                player={player}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* ========================================================
          EDIT PLAYER MODAL
      ========================================================= */}

      {editingPlayer && (
        <ModalEditPlayer
          player={editingPlayer}
          formData={formData}
          clubs={clubs}
          onChange={handleChange}
          onSave={handleUpdate}
          onCancel={handleCancel}
          onDelete={deletePlayerById}
          loading={saving || deleting}
        />
      )}
    </div>
  );
}

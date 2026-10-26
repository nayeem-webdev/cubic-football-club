import { useEffect, useMemo, useState } from "react";
import { Activity, Check, Hash, Tag, Users, X } from "lucide-react";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

export default function UpdatePlayersBulk() {
  // ============================================================
  // DATA
  // ============================================================

  const [players, setPlayers] = useState([]);
  const [clubs, setClubs] = useState([]);

  // ============================================================
  // UI STATE
  // ============================================================

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedPlayers, setSelectedPlayers] = useState([]);

  // ============================================================
  // FILTER STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClub, setSelectedClub] = useState("all");
  const [selectedPosition, setSelectedPosition] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [sortBy, setSortBy] = useState("nameAsc");

  // ============================================================
  // BULK UPDATE STATE
  // ============================================================

  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkClub, setBulkClub] = useState("");

  // ============================================================
  // STYLE
  // ============================================================

  const getFormStyle = (result) => {
    switch (result?.toUpperCase()) {
      case "P":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/10";
      case "A":
        return "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-sm shadow-amber-500/10";
      default:
        return "bg-surface border-border text-text-muted";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "retired":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "inactive":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "backup":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-surface text-text-muted border-border";
    }
  };
  // ============================================================
  // FETCH DATA
  // ============================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [playersResponse, clubsResponse] = await Promise.all([
          fetch(`${API_URL}/players`),
          fetch(`${API_URL}/teams`),
        ]);

        if (!playersResponse.ok) {
          throw new Error("Failed to fetch players");
        }

        if (!clubsResponse.ok) {
          throw new Error("Failed to fetch teams");
        }

        const playersData = await playersResponse.json();
        const clubsData = await clubsResponse.json();

        setPlayers(Array.isArray(playersData) ? playersData : []);
        setClubs(Array.isArray(clubsData) ? clubsData : []);
      } catch (error) {
        console.error("Error fetching bulk player data:", error);
        alert(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ============================================================
  // HELPERS
  // ============================================================

  const getClubId = (player) => {
    if (!player?.playsFor) return "";

    return typeof player.playsFor === "object"
      ? player.playsFor?._id || ""
      : player.playsFor;
  };

  const getClubName = (player) => {
    if (!player?.playsFor) return "No Team";

    if (typeof player.playsFor === "object") {
      return player.playsFor?.name || "No Team";
    }

    const club = clubs.find(
      (club) => String(club._id) === String(player.playsFor),
    );

    return club?.name || "No Team";
  };

  // ============================================================
  // FILTERED PLAYERS
  // ============================================================

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesSearch = (player?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const playerClubId = getClubId(player);

      const matchesClub =
        selectedClub === "all" || String(playerClubId) === String(selectedClub);

      const matchesPosition =
        selectedPosition === "all" || player?.position === selectedPosition;

      const matchesStatus =
        selectedStatus === "all" ||
        (player?.status || "active") === selectedStatus;

      return matchesSearch && matchesClub && matchesPosition && matchesStatus;
    });
  }, [players, searchTerm, selectedClub, selectedPosition, selectedStatus]);

  // ============================================================
  // SELECTION
  // ============================================================

  const isSelected = (playerId) => {
    return selectedPlayers.includes(playerId);
  };

  const togglePlayer = (playerId) => {
    setSelectedPlayers((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId],
    );
  };

  const allFilteredSelected =
    filteredPlayers.length > 0 &&
    filteredPlayers.every((player) => selectedPlayers.includes(player._id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      // Remove only currently filtered players
      setSelectedPlayers((prev) =>
        prev.filter(
          (id) => !filteredPlayers.some((player) => player._id === id),
        ),
      );
    } else {
      // Add currently filtered players
      setSelectedPlayers((prev) => {
        const ids = filteredPlayers.map((player) => player._id);

        return [...new Set([...prev, ...ids])];
      });
    }
  };

  // ============================================================
  // CLEAR SELECTION
  // ============================================================

  const clearSelection = () => {
    setSelectedPlayers([]);
  };

  // ============================================================
  // BULK UPDATE
  // ============================================================

  const handleBulkUpdate = async () => {
    if (selectedPlayers.length === 0) {
      alert("Please select at least one player.");
      return;
    }

    if (!bulkStatus && !bulkClub) {
      alert("Please select a Status or Team to update.");
      return;
    }

    const updates = selectedPlayers.map((playerId) => {
      return {
        _id: playerId,

        ...(bulkStatus
          ? {
              status: bulkStatus,
            }
          : {}),

        ...(bulkClub
          ? {
              playsFor: bulkClub,
            }
          : {}),
      };
    });

    try {
      setSaving(true);

      const response = await fetch(`${API_URL}/players/bulk-update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          players: updates,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to bulk update players",
        );
      }

      // ========================================================
      // UPDATE LOCAL STATE
      // ========================================================

      setPlayers((prevPlayers) =>
        prevPlayers.map((player) => {
          if (!selectedPlayers.includes(player._id)) {
            return player;
          }

          return {
            ...player,

            ...(bulkStatus
              ? {
                  status: bulkStatus,
                }
              : {}),

            ...(bulkClub
              ? {
                  playsFor:
                    clubs.find(
                      (club) => String(club._id) === String(bulkClub),
                    ) || bulkClub,
                }
              : {}),
          };
        }),
      );

      setSelectedPlayers([]);
      setBulkStatus("");
      setBulkClub("");

      alert(
        data.message ||
          `${selectedPlayers.length} player(s) updated successfully.`,
      );
    } catch (error) {
      console.error("Bulk update error:", error);
      alert(error.message || "Failed to update players");
    } finally {
      setSaving(false);
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
            HERO
        ======================================================= */}

        <PageHero
          text="CUBIC FC"
          heading="Bulk Update Players"
          subheading="Select multiple players and update their team or status at once."
        />

        {/* ======================================================
            LOADER
        ======================================================= */}
        {loading && <Loader />}

        {!loading && (
          <>
            {/* ==================================================
                FILTER PANEL
            ================================================== */}
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

            {/* ==================================================
                SELECTION BAR
            ================================================== */}
            <div className="grid grid-cols-1 gap-4 rounded-xl bg-card p-4 text-text-muted sm:grid-cols-2">
              {/* BULK ACTIONS */}
              <div className="min-w-0">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {/* STATUS */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-xs font-medium text-text-muted">
                      New Status
                    </label>

                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-white outline-none"
                    >
                      <option value="">Don't change</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="retired">Retired</option>
                      <option value="backup">Backup</option>
                    </select>
                  </div>

                  {/* TEAM */}
                  <div className="min-w-0">
                    <label className="mb-1.5 block text-xs font-medium text-text-muted">
                      New Team
                    </label>

                    <select
                      value={bulkClub}
                      onChange={(e) => setBulkClub(e.target.value)}
                      className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-white outline-none"
                    >
                      <option value="">Don't change</option>

                      {clubs.map((club) => (
                        <option key={club._id} value={club._id}>
                          {club.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* ACTION */}
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleBulkUpdate}
                      disabled={saving || (!bulkStatus && !bulkClub)}
                      className="h-10 w-full rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Updating..."
                        : `Update ${selectedPlayers.length} Player${
                            selectedPlayers.length !== 1 ? "s" : ""
                          }`}
                    </button>
                  </div>
                </div>
              </div>

              {/* SELECTION INFO */}
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Users size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-text">
                      {selectedPlayers.length} Selected
                    </p>
                    <p className="text-xs text-text-muted">
                      {filteredPlayers.length} players shown
                    </p>
                  </div>
                </div>

                <div className="flex w-full gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    disabled={filteredPlayers.length === 0}
                    className="flex-1 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold text-text transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:px-4"
                  >
                    {allFilteredSelected ? "Deselect All" : "Select All"}
                  </button>

                  <button
                    type="button"
                    onClick={clearSelection}
                    disabled={saving}
                    className="flex-1 rounded-lg border border-border px-3 py-2.5 text-xs font-semibold text-text-muted transition hover:bg-background hover:text-white disabled:opacity-50 sm:flex-none sm:px-5"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>

            {/* ==================================================
                PLAYER CARD GRID (Mobile & Desktop Friendly)
            ================================================== */}
            {filteredAndSortedPlayers.length === 0 ? (
              <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background text-2xl">
                  ⚽
                </div>

                <h3 className="text-sm font-bold text-text">
                  No players found
                </h3>

                <p className="mt-1 text-xs text-text-muted">
                  No players match the selected filters.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-secondary"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPlayers.map((player) => {
                  const selected = isSelected(player._id);
                  const stats = player?.stats || {};

                  return (
                    <article
                      key={player._id}
                      onClick={() => togglePlayer(player._id)}
                      className="group p-4 relative overflow-hidden rounded-2xl bg-card shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-secondary/10"
                    >
                      {/* Top Row: Checkbox, Photo, Name, and Status */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 w-full flex items-center gap-3.5 mb-4">
                          {/* Selection Checkbox */}
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              selected
                                ? "border-primary bg-primary text-white"
                                : "border-border bg-background"
                            }`}
                          >
                            {selected && <Check size={12} />}
                          </div>

                          {/* Player Avatar */}
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/80 shadow-inner">
                            <img
                              src={player?.photo}
                              alt={player?.name || "Player Avatar"}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          </div>

                          {/* Name & Team */}
                          <div className="min-w-0 w-full flex items-center justify-between pt-0.5">
                            <div className="mb-1">
                              <h2 className="truncate text-base font-bold text-text leading-snug">
                                {player?.name}
                              </h2>
                              <span className="block truncate text-xs font-bold text-text-muted">
                                {getClubName(player) || "Free Agent"}
                              </span>
                            </div>

                            <span
                              className={`rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(
                                player?.status,
                              )}`}
                            >
                              {player?.status || "unknown"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Details Grid: Number, Position, Form */}
                      <div className="grid grid-cols-3 gap-1 text-xs">
                        {/* Jersey Number */}
                        <div className="bg-surface p-2.5 rounded-sm">
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                            <Hash
                              size={11}
                              className="text-secondary shrink-0"
                            />{" "}
                            No.
                          </span>
                          <p className="mt-1 font-bold tabular-nums text-text">
                            #{player?.jerseyNumber ?? "-"}
                          </p>
                        </div>

                        {/* Position */}
                        <div className="bg-surface p-2.5 rounded-sm">
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                            <Tag
                              size={11}
                              className="text-secondary shrink-0"
                            />{" "}
                            Pos
                          </span>
                          <p className="mt-1 font-bold truncate text-text">
                            {player?.position || "-"}
                          </p>
                        </div>

                        {/* Recent Form */}
                        <div className="bg-surface p-2.5 rounded-sm">
                          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
                            <Activity
                              size={11}
                              className="text-secondary shrink-0"
                            />{" "}
                            Form
                          </span>
                          <div className="mt-1 flex items-center gap-1">
                            {Array.isArray(stats.participatedLast5) &&
                            stats.participatedLast5.length > 0 ? (
                              stats.participatedLast5.map((result, index) => (
                                <span
                                  key={`${result}-${index}`}
                                  className={`rounded-xs aspect-square px-1 text-[11px] font-black uppercase ${getFormStyle(
                                    result,
                                  )}`}
                                >
                                  {result}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-text-muted italic">
                                No data
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

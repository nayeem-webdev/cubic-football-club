import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Trophy,
  UserCheck,
  UserX,
  UserMinus,
  Users,
  ChevronDown,
  X,
} from "lucide-react";
import PageHero from "../components/PageHero";
import { positions } from "../constants/positions";
import PlayerCard from "../components/PlayerCard";
import Loader from "../components/Loader";

export default function Players() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusTab, setStatusTab] = useState("hallOfFameActive");

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

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

  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("All");
  const [minGoals, setMinGoals] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("averageScore");

  const maxGoals = useMemo(() => {
    return Math.max(0, ...players.map((player) => player.stats?.goals ?? 0));
  }, [players]);

  const maxScore = useMemo(() => {
    return Math.max(
      0,
      ...players.map((player) => player.stats?.playerScore ?? 0),
    );
  }, [players]);

  const filteredPlayers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const data = players.filter((player) => {
      const goals = player.stats?.goals ?? 0;
      const score = player.stats?.playerScore ?? 0;
      const appearances = player.stats?.appearances ?? 0;
      const playerStatus = player.status?.toLowerCase() ?? "active";

      // Status & Category Filter Logic
      // eslint-disable-next-line no-useless-assignment
      let matchesStatus = false;
      switch (statusTab) {
        case "active":
          matchesStatus = playerStatus === "active";
          break;

        case "inactive":
          matchesStatus = playerStatus === "inactive";
          break;

        case "retired":
          matchesStatus = playerStatus === "retired";
          break;

        case "hallOfFameActive":
          // Issue 1: Active players with at least 5 appearances
          matchesStatus = playerStatus === "active" && appearances >= 5;
          break;

        case "hallOfFameActiveRetired":
          // Issue 2: Active & Retired players with at least 5 appearances
          matchesStatus =
            (playerStatus === "active" || playerStatus === "retired") &&
            appearances >= 5;
          break;

        case "all":
          // Issue 3: All players (Active, Inactive, Retired) - No appearance requirement
          matchesStatus = true;
          break;

        default:
          matchesStatus = playerStatus === "active";
      }

      const matchesSearch =
        player.name?.toLowerCase().includes(keyword) ||
        player.playsFor?.name?.toLowerCase().includes(keyword);

      const matchesPosition =
        position === "All" || player.position === position;

      const matchesMinGoals = goals >= Number(minGoals);
      const matchesMinScore = score >= Number(minScore);

      return (
        matchesStatus &&
        matchesSearch &&
        matchesPosition &&
        matchesMinGoals &&
        matchesMinScore
      );
    });

    data.sort((a, b) => {
      const goalsA = a.stats?.goals ?? 0;
      const goalsB = b.stats?.goals ?? 0;

      const assistsA = a.stats?.assists ?? 0;
      const assistsB = b.stats?.assists ?? 0;

      const scoreA = a.stats?.playerScore ?? 0;
      const scoreB = b.stats?.playerScore ?? 0;

      const appearancesA = a.stats?.appearances ?? 0;
      const appearancesB = b.stats?.appearances ?? 0;
      const averageScoreA = appearancesA > 0 ? scoreA / appearancesA : 0;
      const averageScoreB = appearancesB > 0 ? scoreB / appearancesB : 0;

      switch (sortBy) {
        case "name":
          return (a.name ?? "").localeCompare(b.name ?? "");

        case "goals":
          return goalsB - goalsA;

        case "assists":
          return assistsB - assistsA;

        case "score":
          return scoreB - scoreA;

        case "appearances":
          return appearancesB - appearancesA;

        case "ga":
          return goalsB + assistsB - (goalsA + assistsA);

        case "averageScore":
          return averageScoreB - averageScoreA;

        case "jerseyNumber":
          return Number(a.jerseyNumber ?? 999) - Number(b.jerseyNumber ?? 999);

        default:
          return averageScoreB - averageScoreA;
      }
    });

    return data;
  }, [search, players, sortBy, position, minGoals, minScore, statusTab]);

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        {loading && <Loader />}

        {/* Hero */}
        <PageHero
          text={"Football Scout"}
          heading={"Find Your Next Star"}
          subheading={
            "Browse players by position, goals, score and performance. Built for scouting and team management."
          }
        />

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* Sidebar */}
          <aside
            className="w-full lg:w-72 rounded-2xl p-5 h-fit lg:sticky lg:top-5"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            {/* Aside Heading / Mobile Toggle Header */}
            <button
              type="button"
              onClick={toggleFilters}
              className="w-full flex items-center justify-between cursor-pointer lg:cursor-default"
            >
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} />
                <h3 className="font-semibold text-lg">Filters</h3>
              </div>

              {/* Visible on screens up to md, hidden on lg+ */}
              <div className="lg:hidden text-text-muted hover:text-white transition">
                {showFilters ? <X size={20} /> : <ChevronDown size={20} />}
              </div>
            </button>

            {/* Filter Options Wrapper */}
            <div
              className={`grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6 mt-5 lg:block ${
                showFilters ? "block" : "hidden"
              }`}
            >
              {/* Search */}
              <div className="col-span-2 lg:col-span-1">
                <label className="block mb-2 font-medium">Search Player</label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  />
                  <input
                    type="text"
                    placeholder="Name or club"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg py-3 pl-10 pr-3 outline-none"
                    style={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                </div>
              </div>

              {/* Category Options */}
              <div className="col-span-2 lg:col-span-1">
                <p className="mb-3 font-medium text-sm text-gray-400">
                  Category
                </p>
                <div className="flex flex-col gap-2">
                  {/* Current Greats */}
                  <button
                    type="button"
                    onClick={() => setStatusTab("hallOfFameActive")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition text-amber-400"
                    style={{
                      background:
                        statusTab === "hallOfFameActive"
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                    }}
                  >
                    <Trophy size={16} /> Current Greats
                  </button>

                  {/* All-Time Greats */}
                  <button
                    type="button"
                    onClick={() => setStatusTab("hallOfFameActiveRetired")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition text-amber-400"
                    style={{
                      background:
                        statusTab === "hallOfFameActiveRetired"
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                    }}
                  >
                    <Trophy size={16} /> All-Time Greats
                  </button>

                  {/* All Players */}
                  <button
                    type="button"
                    onClick={() => setStatusTab("all")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
                    style={{
                      background:
                        statusTab === "all"
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                    }}
                  >
                    <Users size={16} /> All Players
                  </button>

                  {/* Active Players */}
                  <button
                    type="button"
                    onClick={() => setStatusTab("active")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
                    style={{
                      background:
                        statusTab === "active"
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                    }}
                  >
                    <UserCheck size={16} /> Active Players
                  </button>

                  {/* Retired Players */}
                  <button
                    type="button"
                    onClick={() => setStatusTab("retired")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
                    style={{
                      background:
                        statusTab === "retired"
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                    }}
                  >
                    <UserMinus size={16} /> Retired Players
                  </button>

                  {/* Inactive Players */}
                  <button
                    type="button"
                    onClick={() => setStatusTab("inactive")}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition"
                    style={{
                      background:
                        statusTab === "inactive"
                          ? "var(--color-primary)"
                          : "var(--color-card)",
                    }}
                  >
                    <UserX size={16} /> Inactive Players
                  </button>
                </div>
              </div>

              {/* Sort */}
              <div className="col-span-2 lg:col-span-1">
                <label className="block mb-2 font-medium">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-lg p-3 outline-none"
                  style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <option value="averageScore">Average Score</option>
                  <option value="jerseyNumber">Jersey Number</option>
                  <option value="ga">Goals + Assists</option>
                  <option value="goals">Goals</option>
                  <option value="assists">Assists</option>
                  <option value="score">Score</option>
                  <option value="appearances">Appearances</option>
                  <option value="name">Name (A–Z)</option>
                </select>
              </div>

              {/* Position */}
              <div className="col-span-2 lg:col-span-1">
                <p className="mb-3 font-medium">Position</p>
                <div className="flex flex-wrap gap-2">
                  {positions.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setPosition(item)}
                      className="rounded-full px-3 py-2 text-sm transition"
                      style={{
                        background:
                          position === item
                            ? "var(--color-primary)"
                            : "var(--color-card)",
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Goals */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Minimum Goals</label>
                  <span className="text-sm text-blue-400 font-semibold">
                    {minGoals}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxGoals}
                  value={minGoals}
                  onChange={(e) => setMinGoals(Number(e.target.value))}
                  className="w-full cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0</span>
                  <span>{maxGoals}</span>
                </div>
              </div>

              {/* Minimum Score */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium">Minimum Score</label>
                  <span className="text-sm text-blue-400 font-semibold">
                    {minScore}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxScore}
                  step="0.1"
                  value={minScore}
                  onChange={(e) => setMinScore(Number(e.target.value))}
                  className="w-full cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>0</span>
                  <span>{maxScore}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Cards Display */}
          <div className="flex-1">
            {filteredPlayers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No players found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPlayers.map((player, index) => (
                  <PlayerCard player={player} index={index} key={player._id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

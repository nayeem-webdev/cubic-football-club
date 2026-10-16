import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Trophy,
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
        const response = await fetch(`${API_URL}/player-details`);

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
  // const [minGoals, setMinGoals] = useState(0);
  // const [minScore, setMinScore] = useState(0);
  const [sortBy, setSortBy] = useState("averageScore");

  // const maxGoals = useMemo(() => {
  //   return Math.max(0, ...players.map((player) => player.stats?.goals ?? 0));
  // }, [players]);

  // const maxScore = useMemo(() => {
  //   return Math.max(
  //     0,
  //     ...players.map((player) => player.stats?.playerScore ?? 0),
  //   );
  // }, [players]);

  const filteredPlayers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const data = players.filter((player) => {
      // const goals = player.stats?.goals ?? 0;
      // const score = player.stats?.playerScore ?? 0;
      const appearances = player.stats?.appearances ?? 0;
      const playerStatus = player.status?.toLowerCase() ?? "active";

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
          matchesStatus =
            (playerStatus === "active" || playerStatus === "retired") &&
            appearances >= 5;
          break;

        case "all":
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

      // const matchesMinGoals = goals >= Number(minGoals);
      // const matchesMinScore = score >= Number(minScore);

      return (
        matchesStatus && matchesSearch && matchesPosition
        // matchesMinGoals &&
        // matchesMinScore
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
        case "goals":
          return goalsB - goalsA;

        case "assists":
          return assistsB - assistsA;

        case "score":
          return scoreB - scoreA;

        case "ga":
          return goalsB + assistsB - (goalsA + assistsA);

        case "averageScore":
          return averageScoreB - averageScoreA;

        default:
          return averageScoreB - averageScoreA;
      }
    });

    return data;
  }, [search, players, sortBy, position, statusTab]);

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
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
          <aside className="w-full lg:w-72 rounded-2xl p-5 h-fit lg:sticky lg:top-5 bg-card">
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
              className={`mt-6 ${showFilters ? "block" : "hidden"} lg:block`}
            >
              <div className="space-y-6">
                {/* Search */}
                <div>
                  <label className="block mb-2 font-medium">
                    Search Player
                  </label>

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
                      className="w-full rounded-lg py-3 pl-10 pr-3 outline-none bg-background border border-border"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="block mb-3 font-medium">Category</p>

                  <div className="flex flex-col gap-2 ">
                    {/* Current Greats */}
                    <button
                      type="button"
                      onClick={() => setStatusTab("hallOfFameActive")}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition text-accent"
                      style={{
                        background:
                          statusTab === "hallOfFameActive"
                            ? "var(--color-primary)"
                            : "var(--color-surface)",
                      }}
                    >
                      <Trophy size={16} />
                      Greats of Current Time
                    </button>

                    {/* All-Time Greats */}
                    <button
                      type="button"
                      onClick={() => setStatusTab("hallOfFameActiveRetired")}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition text-accent"
                      style={{
                        background:
                          statusTab === "hallOfFameActiveRetired"
                            ? "var(--color-primary)"
                            : "var(--color-surface)",
                      }}
                    >
                      <Trophy size={16} />
                      Greatest of All Time
                    </button>

                    {/* All Players */}
                    <button
                      type="button"
                      onClick={() => setStatusTab("all")}
                      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition"
                      style={{
                        background:
                          statusTab === "all"
                            ? "var(--color-primary)"
                            : "var(--color-surface)",
                      }}
                    >
                      <Users size={16} />
                      All Players
                    </button>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block mb-2 font-medium">Sort By</label>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full rounded-lg p-3 outline-none bg-background border border-border"
                  >
                    <option value="averageScore">Average Score</option>

                    <option value="score">Score</option>

                    <option value="ga">Goals + Assists</option>

                    <option value="goals">Goals</option>

                    <option value="assists">Assists</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <p className="block mb-3 font-medium">Position</p>

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
                              : "var(--color-surface)",
                        }}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minimum Goals */}
                {/* <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium">Minimum Goals</label>

                    <span className="text-sm text-secondary font-semibold">
                      {minGoals}
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max={maxGoals}
                    value={minGoals}
                    onChange={(e) => setMinGoals(Number(e.target.value))}
                    className="w-full cursor-pointer accent-secondary"
                  />

                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>0</span>
                    <span>{maxGoals}</span>
                  </div>
                </div> */}

                {/* Minimum Score */}
                {/* <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="font-medium">Minimum Score</label>

                    <span className="text-sm text-secondary font-semibold">
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
                    className="w-full cursor-pointer accent-secondary"
                  />

                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>0</span>
                    <span>{maxScore}</span>
                  </div>
                </div> */}
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

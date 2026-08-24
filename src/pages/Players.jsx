import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import PageHero from "../components/PageHero";
import { positions } from "../constants/positions";
import PlayerCard from "../components/PlayerCard";
import Loader from "../components/Loader";

export default function Players() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  // const [minGoals, setMinGoals] = useState(0);
  // const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("ga");

  const filteredPlayers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const data = players.filter((player) => {
      const matchesSearch = player.name?.toLowerCase().includes(keyword);

      const matchesPosition =
        position === "All" || player.position === position;

      return matchesSearch && matchesPosition;
    });

    switch (sortBy) {
      case "name":
        data.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "goals":
        data.sort((a, b) => (b.goals || 0) - (a.goals || 0));
        break;

      case "assists":
        data.sort((a, b) => (b.assists || 0) - (a.assists || 0));
        break;

      default:
        data.sort(
          (a, b) =>
            (b.goals || 0) +
            (b.assists || 0) -
            ((a.goals || 0) + (a.assists || 0)),
        );
        break;
    }

    return data;
  }, [search, players, sortBy, position]);

  return (
    <div
      className="min-h-screen text-text"
      style={{ background: "var(--color-background)" }}
    >
      {loading && <Loader />}

      {/* Hero */}
      <PageHero
        text={"Football Scout"}
        heading={"Find Your Next Star"}
        subheading={
          "Browse players by position, goals, rating and performance. Built for scouting and team management."
        }
      />

      <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Sidebar */}
        <aside
          className="w-full lg:w-72 rounded-2xl p-5 h-fit lg:sticky lg:top-5"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Aside Heading */}
          <div className="flex items-center gap-2 mb-5">
            <SlidersHorizontal size={18} />
            <h3 className="font-semibold text-lg">Filters</h3>
          </div>

          {/* Aside Filters */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1 lg:gap-6">
            {/* Search */}
            <div>
              <label className="block mb-2 font-medium">Search Player</label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="text"
                  placeholder="Name, club or country..."
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

            {/* Sort */}
            <div>
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
                <option value="ga">Goals + Assists</option>
                <option value="goals">Goals</option>
                <option value="assists">Assists</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            {/* Position */}
            <div className="col-span-2 lg:col-span-1">
              <p className="mb-3 font-medium">Position</p>

              <div className="flex flex-wrap gap-2">
                {positions.map((item) => (
                  <button
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
          </div>
        </aside>
        {/* Cards */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard player={player} key={player._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

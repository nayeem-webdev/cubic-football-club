import { useEffect, useState } from "react";
import {
  Users,
  Trophy,
  Shield,
  ChevronDown,
  ChevronUp,
  UserRound,
  Goal,
  Swords,
  AlertCircle,
} from "lucide-react";
import PageHero from "../components/PageHero";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [opponentTeams, setOpponentTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("our");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);

  const displayedTeams = activeTab === "our" ? teams : opponentTeams;

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError("");

        const [ourResponse, opponentResponse] = await Promise.all([
          fetch(`${API_URL}/teams-details`),
          fetch(`${API_URL}/opponent-teams-details`),
        ]);

        if (!ourResponse.ok || !opponentResponse.ok) {
          throw new Error("Failed to fetch teams");
        }

        const [ourData, opponentData] = await Promise.all([
          ourResponse.json(),
          opponentResponse.json(),
        ]);

        setTeams(ourData.teams || []);
        setOpponentTeams(
          opponentData.teams || opponentData.opponentTeams || [],
        );
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Unable to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []); // Runs only when the component mounts

  const toggleTeam = (teamId) => {
    setExpandedTeam((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="CUBIC FC"
          heading={activeTab === "our" ? "Our Teams" : "Opponent Teams"}
          subheading={
            activeTab === "our"
              ? "Meet our registered teams, players, and club statistics."
              : "Explore opponent clubs, their players, and match statistics."
          }
        />
        {/* Team Category Tabs */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border text-text-muted p-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("our");
                setExpandedTeam(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-5 ${
                activeTab === "our"
                  ? "bg-primary text-white shadow-lg"
                  : "text-text-muted hover:bg-card hover:text-white"
              }`}
            >
              <Shield className="h-4 w-4 shrink-0" />
              <span>Our Teams</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "our"
                    ? "bg-white/15 text-white"
                    : "bg-background text-text-muted"
                }`}
              >
                {teams.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("opponent");
                setExpandedTeam(null);
              }}
              className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition sm:px-5 ${
                activeTab === "opponent"
                  ? "bg-primary text-white shadow-lg"
                  : "text-text-muted hover:bg-card hover:text-white"
              }`}
            >
              <Swords className="h-4 w-4 shrink-0" />
              <span>Opponent Teams</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === "opponent"
                    ? "bg-white/15 text-white"
                    : "bg-background text-text-muted"
                }`}
              >
                {opponentTeams.length}
              </span>
            </button>
          </div>
        </div>
        {/* Loading */}
        {loading && <Loader />}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && displayedTeams.length === 0 && (
          <div className="mt-10 rounded-2xl border border-border text-text-muted px-6 py-16 text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-text-muted" />

            <h3 className="text-lg font-semibold">
              {activeTab === "our"
                ? "No teams available"
                : "No opponent teams available"}
            </h3>

            <p className="mt-2 text-sm text-text-muted">
              {activeTab === "our"
                ? "Our teams will appear here once they are registered."
                : "Opponent teams will appear here once they are added."}
            </p>
          </div>
        )}

        {/* Teams */}
        {!loading && !error && displayedTeams.length > 0 && (
          <div className="space-y-8">
            {displayedTeams.map((team) => {
              const stats = team.statistics || {};
              const players = team.players || [];
              const isExpanded = expandedTeam === team._id;

              const played = stats.played || 0;
              const won = stats.won || 0;
              const draw = stats.draw || 0;
              const lost = stats.lost || 0;

              const winPercentage =
                played > 0 ? Math.round((won / played) * 100) : 0;

              return (
                <section
                  key={team._id}
                  className="overflow-hidden rounded-2xl bg-card shadow-xl shadow-black/10"
                >
                  {/* Team Header */}
                  <div className="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
                    {/* Subtle background glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Team Identity */}
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex h-20 w-20 lg:h-24 lg:w-24 shrink-0 items-center justify-center">
                          <img
                            src={team.logoHigh || team.logoLow}
                            alt={`${team.name} logo`}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-md bg-accent/5 px-2 py-1 text-[10px] font-bold tracking-[0.2em] text-accent">
                              {team.shortForm}
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {team.name}
                          </h2>

                          {team.captain && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
                              <Shield className="h-4 w-4 text-accent fill-accent" />
                              <span>Captain:</span>
                              <span className="font-medium text-text">
                                {team.captain.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:min-w-97.5">
                        <StatBox
                          label="Played"
                          value={played}
                          icon={<Swords className="h-4 w-4" />}
                        />
                        <StatBox
                          label="Won"
                          value={won}
                          icon={<Trophy className="h-4 w-4" />}
                          valueClass="text-secondary"
                        />
                        <StatBox
                          label="Draw"
                          value={draw}
                          icon={<Goal className="h-4 w-4" />}
                          valueClass="text-accent"
                        />
                        <StatBox
                          label="Lost"
                          value={lost}
                          icon={<Shield className="h-4 w-4" />}
                          valueClass="text-red-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Team Summary */}
                  <div className="border-t border-border bg-card/50 px-5 py-4 sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <Users className="h-4 w-4 text-secondary" />
                        <span>
                          <strong className="text-text">
                            {players.length}
                          </strong>{" "}
                          {players.length === 1 ? "Player" : "Players"}
                        </span>

                        <span className="mx-1 text-surface">•</span>

                        <span>
                          <strong className="text-text">
                            {winPercentage}%
                          </strong>{" "}
                          win rate
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTeam(team._id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-border text-text-muted px-4 py-2.5 text-sm font-medium hover:text-text transition hover:border-secondary hover:bg-primary/10"
                      >
                        <Users className="h-4 w-4 text-secondary" />
                        {isExpanded ? "Hide Squad" : "View Squad"}

                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Squad */}
                  {isExpanded && (
                    <div className="border-t border-border px-5 py-6 sm:px-8 sm:py-8">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {team.shortForm} Squad
                          </h3>
                          <p className="mt-1 text-sm text-text-muted">
                            Players registered under {team.name}
                          </p>
                        </div>

                        <span className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-muted">
                          {players.length} players
                        </span>
                      </div>

                      {players.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border py-10 text-center">
                          <UserRound className="mx-auto mb-3 h-8 w-8 text-text-muted" />
                          <p className="text-sm text-text-muted">
                            No players registered for this team.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {["GK", "DF", "MF", "FW", "ST"].map((position) => {
                            const positionPlayers = players.filter(
                              (player) => player.position === position,
                            );

                            if (positionPlayers.length === 0) return null;

                            const positionLabels = {
                              GK: "Goalkeepers",
                              DF: "Defenders",
                              MF: "Midfielders",
                              FW: "Forwards",
                              ST: "Strikers",
                            };

                            return (
                              <div key={position}>
                                {/* Position Heading */}
                                <div className="mb-4 flex items-center gap-3">
                                  <div className="h-5 w-1 rounded-full bg-accent" />

                                  <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-text">
                                    {positionLabels[position]}
                                  </h4>

                                  <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-text-muted">
                                    {positionPlayers.length}
                                  </span>
                                </div>

                                {/* Players in this position */}
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                  {positionPlayers.map((player) => {
                                    const isCaptain =
                                      team.captain?._id === player._id;

                                    return (
                                      <div
                                        key={player._id}
                                        className="group flex items-center gap-4 rounded-xl border border-border bg-background p-3 transition hover:border-secondary/60 hover:text-text-muted"
                                      >
                                        {/* Player Photo */}
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-card">
                                          <img
                                            src={
                                              player.photo ||
                                              "/assets/player-placeholder.png"
                                            }
                                            alt={player.name}
                                            className="h-full w-full object-cover"
                                            onError={(e) => {
                                              e.currentTarget.src =
                                                "/assets/player-placeholder.png";
                                            }}
                                          />

                                          {/* Jersey Number */}
                                          <span className="absolute bottom-0 right-0 rounded-tl-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
                                            {player.jerseyNumber}
                                          </span>
                                        </div>

                                        {/* Player Info */}
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="truncate font-semibold text-text">
                                              {player.name}
                                            </h4>

                                            {isCaptain && (
                                              <span
                                                className="shrink-0 text-accent"
                                                title="Captain"
                                              >
                                                <Shield className="h-3.5 w-3.5 fill-current" />
                                              </span>
                                            )}
                                          </div>

                                          <div className="mt-1 flex items-center gap-2 text-xs text-text-muted">
                                            <span className="font-medium text-secondary">
                                              {player.position}
                                            </span>

                                            <span className="text-secondary/50">
                                              •
                                            </span>

                                            <span>{player.foot} foot</span>
                                          </div>

                                          {isCaptain && (
                                            <span className="mt-2 inline-flex rounded bg-accent/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent">
                                              Captain
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon, valueClass = "text-text" }) => {
  return (
    <div className="rounded-xl bg-background px-2 py-3 text-center sm:px-4">
      <div className="mb-1 flex items-center justify-center gap-1 text-text-muted">
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wider sm:text-[10px]">
          {label}
        </span>
      </div>

      <p className={`text-xl font-bold sm:text-2xl ${valueClass}`}>{value}</p>
    </div>
  );
};

export default Teams;

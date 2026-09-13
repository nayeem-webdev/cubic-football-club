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
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import PageHero from "../components/PageHero";

const API_URL = import.meta.env.VITE_API_URL;

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/teams-details`);

        if (!response.ok) {
          throw new Error("Failed to fetch teams");
        }

        const data = await response.json();

        setTeams(data.teams || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Unable to load teams. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const toggleTeam = (teamId) => {
    setExpandedTeam((prev) => (prev === teamId ? null : teamId));
  };

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="CUBIC FC"
          heading="Our Teams"
          subheading="Meet the teams, players, and competitors that make every match count."
        />

        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-[#B8C2D1]">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#3A82FF]" />
              <span>Loading teams...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mx-auto mt-10 flex max-w-xl items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && teams.length === 0 && (
          <div className="mt-10 rounded-2xl border border-[#28466B] bg-[#0E1D34] px-6 py-16 text-center">
            <Users className="mx-auto mb-4 h-10 w-10 text-[#B8C2D1]" />
            <h3 className="text-lg font-semibold">No teams available</h3>
            <p className="mt-2 text-sm text-[#B8C2D1]">
              Teams will appear here once they are registered.
            </p>
          </div>
        )}

        {/* Teams */}
        {!loading && !error && teams.length > 0 && (
          <div className="mt-12 space-y-8">
            {teams.map((team) => {
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
                  className="overflow-hidden rounded-2xl border border-[#28466B] bg-[#0E1D34] shadow-xl shadow-black/10"
                >
                  {/* Team Header */}
                  <div className="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8">
                    {/* Subtle background glow */}
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#0E5FD8]/10 blur-3xl" />

                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                      {/* Team Identity */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#28466B] bg-[#07111F] p-3 sm:h-28 sm:w-28 sm:p-4">
                          <img
                            src={team.logoHigh || team.logoLow}
                            alt={`${team.name} logo`}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <span className="rounded-md bg-[#D4AF37]/10 px-2 py-1 text-[10px] font-bold tracking-[0.2em] text-[#D4AF37]">
                              {team.shortForm}
                            </span>

                            <span className="text-xs uppercase tracking-wider text-[#B8C2D1]">
                              Football Club
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            {team.name}
                          </h2>

                          {team.captain && (
                            <div className="mt-3 flex items-center gap-2 text-sm text-[#B8C2D1]">
                              <Shield className="h-4 w-4 text-[#D4AF37]" />
                              <span>Captain:</span>
                              <span className="font-medium text-[#F8FAFC]">
                                {team.captain.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Team Stats */}
                      <div className="grid grid-cols-4 gap-2 sm:gap-3 lg:min-w-[390px]">
                        <StatBox
                          label="Played"
                          value={played}
                          icon={<Swords className="h-4 w-4" />}
                        />
                        <StatBox
                          label="Won"
                          value={won}
                          icon={<Trophy className="h-4 w-4" />}
                          valueClass="text-[#49C85A]"
                        />
                        <StatBox
                          label="Draw"
                          value={draw}
                          icon={<Goal className="h-4 w-4" />}
                          valueClass="text-[#D4AF37]"
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
                  <div className="border-t border-[#28466B] bg-[#152640]/50 px-5 py-4 sm:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-sm text-[#B8C2D1]">
                        <Users className="h-4 w-4 text-[#3A82FF]" />
                        <span>
                          <strong className="text-[#F8FAFC]">
                            {players.length}
                          </strong>{" "}
                          {players.length === 1 ? "Player" : "Players"}
                        </span>

                        <span className="mx-1 text-[#28466B]">•</span>

                        <span>
                          <strong className="text-[#F8FAFC]">
                            {winPercentage}%
                          </strong>{" "}
                          win rate
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTeam(team._id)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-[#28466B] bg-[#0E1D34] px-4 py-2.5 text-sm font-medium text-[#F8FAFC] transition hover:border-[#3A82FF] hover:bg-[#0E5FD8]/10"
                      >
                        <Users className="h-4 w-4 text-[#3A82FF]" />
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
                    <div className="border-t border-[#28466B] px-5 py-6 sm:px-8 sm:py-8">
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {team.shortForm} Squad
                          </h3>
                          <p className="mt-1 text-sm text-[#B8C2D1]">
                            Players registered under {team.name}
                          </p>
                        </div>

                        <span className="rounded-full border border-[#28466B] bg-[#07111F] px-3 py-1 text-xs text-[#B8C2D1]">
                          {players.length} players
                        </span>
                      </div>

                      {players.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-[#28466B] py-10 text-center">
                          <UserRound className="mx-auto mb-3 h-8 w-8 text-[#B8C2D1]" />
                          <p className="text-sm text-[#B8C2D1]">
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
                                  <div className="h-5 w-1 rounded-full bg-[#D4AF37]" />

                                  <h4 className="text-sm font-bold uppercase tracking-[0.15em] text-[#F8FAFC]">
                                    {positionLabels[position]}
                                  </h4>

                                  <span className="rounded-full border border-[#28466B] bg-[#07111F] px-2 py-0.5 text-[10px] text-[#B8C2D1]">
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
                                        className="group flex items-center gap-4 rounded-xl border border-[#28466B] bg-[#07111F] p-3 transition hover:border-[#3A82FF]/60 hover:bg-[#0E1D34]"
                                      >
                                        {/* Player Photo */}
                                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-[#28466B] bg-[#152640]">
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
                                          <span className="absolute bottom-0 right-0 rounded-tl-md bg-[#0E5FD8] px-1.5 py-0.5 text-[10px] font-bold text-white">
                                            {player.jerseyNumber}
                                          </span>
                                        </div>

                                        {/* Player Info */}
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2">
                                            <h4 className="truncate font-semibold text-[#F8FAFC]">
                                              {player.name}
                                            </h4>

                                            {isCaptain && (
                                              <span
                                                className="shrink-0 text-[#D4AF37]"
                                                title="Captain"
                                              >
                                                <Shield className="h-3.5 w-3.5 fill-current" />
                                              </span>
                                            )}
                                          </div>

                                          <div className="mt-1 flex items-center gap-2 text-xs text-[#B8C2D1]">
                                            <span className="font-medium text-[#3A82FF]">
                                              {player.position}
                                            </span>

                                            <span className="text-[#28466B]">
                                              •
                                            </span>

                                            <span>{player.foot} foot</span>
                                          </div>

                                          {isCaptain && (
                                            <span className="mt-2 inline-flex rounded bg-[#D4AF37]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#D4AF37]">
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

const StatBox = ({ label, value, icon, valueClass = "text-[#F8FAFC]" }) => {
  return (
    <div className="rounded-xl border border-[#28466B] bg-[#07111F] px-2 py-3 text-center sm:px-4">
      <div className="mb-1 flex items-center justify-center gap-1 text-[#B8C2D1]">
        {icon}
        <span className="text-[9px] font-medium uppercase tracking-wider sm:text-[10px]">
          {label}
        </span>
      </div>

      <p className={`text-xl font-bold sm:text-2xl ${valueClass}`}>{value}</p>
    </div>
  );
};

export default Teams;

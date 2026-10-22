import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to normalize Object IDs
const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    if (value._id) return getId(value._id);
    if (value.$oid) return value.$oid;
  }
  return String(value);
};

const EditMatch = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matchDetails, setMatchDetails] = useState(null);
  const [players, setPlayers] = useState([]);
  const [opponentPlayers, setOpponentPlayers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    matchTime: "",
    homeStartingPlayers: [],
    homeSubstitutes: [],
    awayStartingPlayers: [],
    awaySubstitutes: [],
  });

  // --------------------------------------------------
  // Fetch single match & all players
  // --------------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPageLoading(true);

        const [matchResponse, playersResponse, opponentPlayersResponse] =
          await Promise.all([
            fetch(`${API_URL}/matches/${id}`),
            fetch(`${API_URL}/players`),
            fetch(`${API_URL}/opponent-players`),
          ]);

        if (
          !matchResponse.ok ||
          !playersResponse.ok ||
          !opponentPlayersResponse.ok
        ) {
          throw new Error("Failed to fetch match or players data");
        }

        const [matchResult, playersResult, opponentPlayersResult] =
          await Promise.all([
            matchResponse.json(),
            playersResponse.json(),
            opponentPlayersResponse.json(),
          ]);

        const opponentPlayersList = Array.isArray(
          opponentPlayersResult?.opponentPlayers,
        )
          ? opponentPlayersResult.opponentPlayers
          : Array.isArray(opponentPlayersResult)
            ? opponentPlayersResult
            : opponentPlayersResult?.data || [];

        const matchData =
          matchResult?.match || matchResult?.data || matchResult;
        const playersList = Array.isArray(playersResult?.players)
          ? playersResult.players
          : Array.isArray(playersResult)
            ? playersResult
            : playersResult?.data || [];

        setMatchDetails(matchData);
        setPlayers(playersList);
        setOpponentPlayers(opponentPlayersList);

        // Calculate format requirement
        const formatCount = Number(matchData?.matchSchedule?.matchFormat) || 0;

        // Initialize players array to match required squad length
        const mapSquadArray = (arr, targetLength) => {
          const extracted = Array.isArray(arr) ? arr.map(getId) : [];
          if (targetLength <= 0) return extracted;
          return Array.from(
            { length: targetLength },
            (_, i) => extracted[i] || "",
          );
        };

        setFormData({
          matchTime: String(matchData?.matchTime || "90"),
          homeStartingPlayers: mapSquadArray(
            matchData?.homeStartingPlayers,
            formatCount,
          ),
          homeSubstitutes: mapSquadArray(matchData?.homeSubstitutes, 3),
          awayStartingPlayers: mapSquadArray(
            matchData?.awayStartingPlayers,
            formatCount,
          ),
          awaySubstitutes: mapSquadArray(matchData?.awaySubstitutes, 3),
        });
      } catch (error) {
        console.error("Error loading update match page:", error);
        setMessage(error.message || "Failed to load match details");
      } finally {
        setPageLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  // Extract reference objects
  const homeTeam = matchDetails?.homeTeam;
  const awayTeam = matchDetails?.awayTeam;
  const schedule = matchDetails?.matchSchedule;
  // Filter players by team

  const homeTeamPlayers = useMemo(() => {
    if (!homeTeam?._id) return [];

    const isCubicFC = homeTeam.name?.trim().toUpperCase() === "CUBIC FC";

    const sourcePlayers = isCubicFC
      ? players
      : [...players, ...opponentPlayers];

    return sourcePlayers.filter(
      (player) => getId(player.playsFor) === getId(homeTeam._id),
    );
  }, [players, opponentPlayers, homeTeam]);

  const awayTeamPlayers = useMemo(() => {
    if (!awayTeam?._id) return [];

    const isCubicFC = awayTeam.name?.trim().toUpperCase() === "CUBIC FC";

    const sourcePlayers = isCubicFC
      ? players
      : [...players, ...opponentPlayers];

    return sourcePlayers.filter(
      (player) => getId(player.playsFor) === getId(awayTeam._id),
    );
  }, [players, opponentPlayers, awayTeam]);

  // Selected player IDs (for duplicate filtering)
  const homeSelectedPlayerIds = useMemo(() => {
    return [
      ...formData.homeStartingPlayers,
      ...formData.homeSubstitutes,
    ].filter(Boolean);
  }, [formData.homeStartingPlayers, formData.homeSubstitutes]);

  const awaySelectedPlayerIds = useMemo(() => {
    return [
      ...formData.awayStartingPlayers,
      ...formData.awaySubstitutes,
    ].filter(Boolean);
  }, [formData.awayStartingPlayers, formData.awaySubstitutes]);

  // Form input handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePlayerChange = (field, index, value) => {
    setFormData((prev) => {
      const updatedPlayers = [...prev[field]];
      updatedPlayers[index] = value;
      return {
        ...prev,
        [field]: updatedPlayers,
      };
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const submitData = {
      matchTime: formData.matchTime,
      homeStartingPlayers: formData.homeStartingPlayers.filter(Boolean),
      homeSubstitutes: formData.homeSubstitutes.filter(Boolean),
      awayStartingPlayers: formData.awayStartingPlayers.filter(Boolean),
      awaySubstitutes: formData.awaySubstitutes.filter(Boolean),
    };

    try {
      const response = await fetch(`${API_URL}/matches/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          `Server returned status ${response.status}. Route path may be invalid.`,
        );
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update match");
      }

      setMessage("Match updated successfully!");
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.error("Error updating match:", error);
      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this match? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch(`${API_URL}/matches/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete match");
      }

      navigate("/update-match");
    } catch (error) {
      console.error("Error deleting match:", error);
      setMessage(error.message || "Failed to delete match");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-3xl">
        {pageLoading && <Loader />}
        {/* Header */}
        <PageHero
          text="CUBIC FC"
          heading="Update Match"
          subheading="Update lineup allocations and match duration."
        />

        {/* Main Card */}
        <div className="rounded-2xl bg-card text-text p-6 shadow-2xl md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Match Format & Type Badges */}
            {/* Match Details */}
            <div className="grid grid-cols-2 gap-6">
              {/* Match Type */}
              {schedule?.matchType && (
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
                  <span className="text-sm text-text-muted">Match Type</span>
                  <div className="text-lg font-bold text-secondary">
                    {schedule.matchType.charAt(0).toUpperCase() +
                      schedule.matchType.slice(1)}{" "}
                    Match
                  </div>
                </div>
              )}

              {/* Match Format */}
              {schedule?.matchFormat && (
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
                  <span className="text-sm text-text-muted">Match Format</span>
                  <div className="text-lg font-bold text-secondary">
                    {schedule.matchFormat} V {schedule.matchFormat}
                  </div>
                </div>
              )}

              {/* Match Date */}
              {schedule?.date && (
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
                  <span className="text-sm text-text-muted">Match Date</span>
                  <div className="text-lg font-bold text-secondary">
                    {schedule.date}
                  </div>
                </div>
              )}

              {/* Match Date */}
              {schedule?.venue?.venue && (
                <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
                  <span className="text-sm text-text-muted">Match Venue</span>
                  <div className="text-lg font-bold text-secondary">
                    {schedule.venue.venue}
                  </div>
                </div>
              )}
            </div>

            {/* Editable Match Time */}
            <div>
              <label htmlFor="matchTime" className="block mb-2 font-medium">
                Match Time
              </label>
              <select
                name="matchTime"
                value={formData.matchTime}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
              >
                <option value="">Select match time</option>
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>
            {/* Accent Line */}
            <div className="mt-6 border-t-2 border-secondary" />

            {/* Teams & Squad Lists */}
            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
              {/* ================= HOME TEAM ================= */}
              <div>
                <label className="mb-2 block text-xl font-bold text-secondary">
                  Home Team: {homeTeam?.name || "N/A"}
                </label>

                {/* Home Starting Players */}
                <div className="mt-6">
                  <div className="grid grid-cols-1 gap-4">
                    {formData.homeStartingPlayers.map(
                      (selectedPlayer, index) => (
                        <div key={`home-start-${index}`}>
                          <label className="mb-2 block text-sm">
                            Player {index + 1}
                          </label>
                          <select
                            value={selectedPlayer}
                            onChange={(e) =>
                              handlePlayerChange(
                                "homeStartingPlayers",
                                index,
                                e.target.value,
                              )
                            }
                            required
                            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                          >
                            <option value="">Select player</option>
                            {homeTeamPlayers
                              .filter(
                                (p) =>
                                  !homeSelectedPlayerIds.includes(p._id) ||
                                  p._id === selectedPlayer,
                              )
                              .map((player) => (
                                <option key={player._id} value={player._id}>
                                  {player.name} ({player.position})
                                </option>
                              ))}
                          </select>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Home Substitutes */}
                <div className="mt-6">
                  <h2 className="mb-1 text-xl font-bold text-secondary">
                    Home Substitutes{" "}
                    <span className="text-text-muted text-sm">
                      (Optional)
                    </span>{" "}
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {formData.homeSubstitutes.map((selectedPlayer, index) => (
                      <div key={`home-sub-${index}`}>
                        <label className="mb-2 block text-sm">
                          Substitute {index + 1}
                        </label>
                        <select
                          value={selectedPlayer}
                          onChange={(e) =>
                            handlePlayerChange(
                              "homeSubstitutes",
                              index,
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                        >
                          <option value="">Select substitute</option>
                          {homeTeamPlayers
                            .filter(
                              (p) =>
                                !homeSelectedPlayerIds.includes(p._id) ||
                                p._id === selectedPlayer,
                            )
                            .map((player) => (
                              <option key={player._id} value={player._id}>
                                {player.name} ({player.position})
                              </option>
                            ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Mobile Divider */}
              <div className="border-t-2 border-accent lg:hidden" />

              {/* ================= AWAY TEAM ================= */}
              <div>
                <label className="mb-2 block text-xl font-bold text-secondary">
                  Away Team: {awayTeam?.name || "N/A"}
                </label>

                {/* Away Starting Players */}
                <div className="mt-6">
                  <div className="grid grid-cols-1 gap-4">
                    {formData.awayStartingPlayers.map(
                      (selectedPlayer, index) => (
                        <div key={`away-start-${index}`}>
                          <label className="mb-2 block text-sm">
                            Player {index + 1}
                          </label>
                          <select
                            value={selectedPlayer}
                            onChange={(e) =>
                              handlePlayerChange(
                                "awayStartingPlayers",
                                index,
                                e.target.value,
                              )
                            }
                            required
                            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                          >
                            <option value="">Select player</option>
                            {awayTeamPlayers
                              .filter(
                                (p) =>
                                  !awaySelectedPlayerIds.includes(p._id) ||
                                  p._id === selectedPlayer,
                              )
                              .map((player) => (
                                <option key={player._id} value={player._id}>
                                  {player.name} ({player.position})
                                </option>
                              ))}
                          </select>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Away Substitutes */}
                <div className="mt-6">
                  <h2 className="mb-1 text-xl font-bold text-secondary">
                    Away Substitutes{" "}
                    <span className="text-text-muted text-sm">(Optional)</span>
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    {formData.awaySubstitutes.map((selectedPlayer, index) => (
                      <div key={`away-sub-${index}`}>
                        <label className="mb-2 block text-sm">
                          Substitute {index + 1}
                        </label>
                        <select
                          value={selectedPlayer}
                          onChange={(e) =>
                            handlePlayerChange(
                              "awaySubstitutes",
                              index,
                              e.target.value,
                            )
                          }
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-text outline-none placeholder:text-text-muted focus:border-secondary/70"
                        >
                          <option value="">Select substitute</option>
                          {awayTeamPlayers
                            .filter(
                              (p) =>
                                !awaySelectedPlayerIds.includes(p._id) ||
                                p._id === selectedPlayer,
                            )
                            .map((player) => (
                              <option key={player._id} value={player._id}>
                                {player.name} ({player.position})
                              </option>
                            ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-border" />

            {/* Action Buttons */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || loading}
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting Match..." : "Delete Match"}
              </button>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => navigate(`/upcoming-matches/${id}`)}
                  disabled={loading || deleting}
                  className="rounded-xl border border-border px-6 py-3 font-semibold text-text-muted transition hover:border-secondary hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || deleting}
                  className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Saving Changes..." : "Save Lineup"}
                </button>
              </div>
            </div>
          </form>

          {/* Alert Message */}
          {message && (
            <div
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                message.includes("successfully")
                  ? "border-secondary/30 bg-[#49C85A]/10 text-[#49C85A]"
                  : "border-red-500/30 bg-red-500/10 text-red-400"
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMatch;

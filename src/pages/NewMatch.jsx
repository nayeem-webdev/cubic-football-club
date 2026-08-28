import Loader from "../components/Loader";
import { useEffect, useState } from "react";
import PageHero from "../components/PageHero";

const NewMatch = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [playersResponse, teamsResponse, scheduleResponse] =
          await Promise.all([
            fetch(`${API_URL}/players`),
            fetch(`${API_URL}/teams`),
            fetch(`${API_URL}/schedules`),
          ]);

        if (!playersResponse.ok || !teamsResponse.ok || !scheduleResponse.ok) {
          throw new Error("Failed to fetch players or teams");
        }

        const [playersData, teamsData, scheduleData] = await Promise.all([
          playersResponse.json(),
          teamsResponse.json(),
          scheduleResponse.json(),
        ]);

        setPlayers(playersData);
        setTeams(teamsData);
        setSchedules(scheduleData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  //!! Form Data and Handler
  const [formData, setFormData] = useState({
    homeTeam: "",
    awayTeam: "",

    playersPerTeam: "",
    matchTime: "",
    matchType: "",
    matchSchedule: "",

    homeStartingPlayers: [],
    homeSubstitutes: [],

    awayStartingPlayers: [],
    awaySubstitutes: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // When a schedule is selected
    if (name === "matchSchedule") {
      const selectedSchedule = schedules.find(
        (schedule) => schedule._id === value,
      );

      if (!selectedSchedule) return;

      const numberOfPlayers = Number(selectedSchedule.matchFormat);

      setFormData((prev) => ({
        ...prev,

        // Selected schedule ID
        matchSchedule: value,

        // Automatically get data from schedule
        playersPerTeam: selectedSchedule.matchFormat,
        matchType: selectedSchedule.matchType,

        // Create player selection slots automatically
        homeStartingPlayers: Array(numberOfPlayers).fill(""),
        awayStartingPlayers: Array(numberOfPlayers).fill(""),

        // Optional substitutes
        homeSubstitutes: Array(3).fill(""),
        awaySubstitutes: Array(3).fill(""),
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //!! Form Data and Handler

  //## Team Player Lists

  const selectedHomeTeam = teams.find((team) => team._id === formData.homeTeam);

  const selectedAwayTeam = teams.find((team) => team._id === formData.awayTeam);

  const homeTeamPlayers = players.filter(
    (player) => player.playsFor === selectedHomeTeam?.name,
  );

  const awayTeamPlayers = players.filter(
    (player) => player.playsFor === selectedAwayTeam?.name,
  );

  //%% Player Handler

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

  //%% Selected IDs for Home

  const homeSelectedPlayerIds = [
    ...formData.homeStartingPlayers,
    ...formData.homeSubstitutes,
  ].filter(Boolean);
  //%% Selected IDs for Away

  const awaySelectedPlayerIds = [
    ...formData.awayStartingPlayers,
    ...formData.awaySubstitutes,
  ].filter(Boolean);

  //## Team Player Lists

  // %% Data Submit handler

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const submitData = {
      ...formData,

      homeStartingPlayers: formData.homeStartingPlayers.filter(Boolean),
      homeSubstitutes: formData.homeSubstitutes.filter(Boolean),

      awayStartingPlayers: formData.awayStartingPlayers.filter(Boolean),
      awaySubstitutes: formData.awaySubstitutes.filter(Boolean),
    };

    try {
      const response = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to create match");
      }

      console.log("Match created successfully:", data.match);

      setMessage("Match created successfully!");

      // Reset form
      setFormData({
        homeTeam: "",
        awayTeam: "",
        playersPerTeam: "",
        matchTime: "",
        matchType: "",
        matchSchedule: "",

        homeStartingPlayers: [],
        homeSubstitutes: [],

        awayStartingPlayers: [],
        awaySubstitutes: [],
      });
    } catch (error) {
      console.error("Error creating match:", error);

      setMessage(error.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // %% Data Submit handler

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-3xl">
        {pageLoading && <Loader />}

        {/* Header */}
        <PageHero
          text="CUBIC FC"
          heading="New Match"
          subheading="Create a new match, set up squad and time."
        />

        {/* Main Form Div */}
        <div className=" rounded-2xl border border-[#28466B] bg-[#0E1D34] p-6 shadow-xl sm:p-8 ">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Number of Players and Match Time, Type, Schedule */}
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6">
              {/* Match Time */}
              <div>
                <label
                  htmlFor="matchTime"
                  className="mb-2 block text-sm font-medium"
                >
                  Match Time
                </label>

                <select
                  name="matchTime"
                  value={formData.matchTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="">Select match time</option>

                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                  <option value="90">90 Minutes</option>
                </select>
              </div>

              {/* Select Match */}
              <div>
                <label
                  htmlFor="matchSchedule"
                  className="mb-2 block text-sm font-medium"
                >
                  Select Match
                </label>
                <select
                  name="matchSchedule"
                  value={formData.matchSchedule}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="">Select Match</option>

                  {schedules.map((schedule) => (
                    <option key={schedule._id} value={schedule._id}>
                      {schedule.venue?.venue} — {schedule.date} —{" "}
                      {schedule.time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Divider Div */}
            <div className="border-t-4 border-secondary mt-6" />

            {/* Select Home and Away Team */}
            <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-6">
              {/* Select Home Team */}
              <div>
                <label
                  htmlFor="selectHomeTeam"
                  className="mb-2 block text-xl text-secondary font-bold"
                >
                  Select Home Team
                </label>
                <select
                  name="homeTeam"
                  value={formData.homeTeam}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="">Select home team</option>

                  {teams
                    .filter((team) => team._id !== formData.awayTeam)
                    .map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                </select>
                {/* players */}
                {formData.playersPerTeam && (
                  <div>
                    {formData.playersPerTeam && formData.homeTeam && (
                      <div className="mt6">
                        <h2 className="mt-6 mb-1 text-xl font-bold text-secondary ">
                          Home Players
                        </h2>
                        <div className="grid gap-4 grid-cols-1">
                          {formData.homeStartingPlayers.map(
                            (selectedPlayer, index) => (
                              <div key={index}>
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
                                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                                >
                                  <option value="">Select player</option>
                                  {/* homeTeamPlayers */}
                                  {homeTeamPlayers
                                    .filter(
                                      (player) =>
                                        !homeSelectedPlayerIds.includes(
                                          player._id,
                                        ) || player._id === selectedPlayer,
                                    )
                                    .map((player) => (
                                      <option
                                        key={player._id}
                                        value={player._id}
                                      >
                                        {player.name} ({player.position})
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                    {/* Home Subs */}
                    {formData.playersPerTeam && formData.homeTeam && (
                      <div className="mt-6">
                        <h2 className="mb-1 text-xl font-bold text-secondary ">
                          Home Substitutes (Optional)
                        </h2>

                        <div className="grid gap-4 grid-cols-1">
                          {formData.homeSubstitutes.map(
                            (selectedPlayer, index) => (
                              <div key={index}>
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
                                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC]"
                                >
                                  <option value="">Select substitute</option>
                                  {/* homeTeamPlayers */}
                                  {homeTeamPlayers
                                    .filter(
                                      (player) =>
                                        !homeSelectedPlayerIds.includes(
                                          player._id,
                                        ) || player._id === selectedPlayer,
                                    )
                                    .map((player) => (
                                      <option
                                        key={player._id}
                                        value={player._id}
                                      >
                                        {player.name} ({player.position})
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Divider Div */}
              <div className="border-t-4 border-accent lg:hidden" />

              {/* Select Away Team */}
              <div>
                <label
                  htmlFor="selectAwayTeam"
                  className="mb-2 block text-xl text-secondary font-bold"
                >
                  Select Away Team
                </label>
                <select
                  name="awayTeam"
                  value={formData.awayTeam}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                >
                  <option value="">Select away team</option>

                  {teams
                    .filter((team) => team._id !== formData.homeTeam)
                    .map((team) => (
                      <option key={team._id} value={team._id}>
                        {team.name}
                      </option>
                    ))}
                </select>
                {/* away players */}
                {formData.playersPerTeam && (
                  <div>
                    {formData.playersPerTeam && formData.awayTeam && (
                      <div className="mt6">
                        <h2 className="mt-6 mb-1 text-xl font-bold text-secondary">
                          Away Players
                        </h2>
                        <div className="grid gap-4 grid-cols-1">
                          {formData.awayStartingPlayers.map(
                            (selectedPlayer, index) => (
                              <div key={index}>
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
                                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC] outline-none focus:border-[#0E5FD8]"
                                >
                                  <option value="">Select player</option>
                                  {/* awayTeamPlayers */}
                                  {awayTeamPlayers
                                    .filter(
                                      (player) =>
                                        !awaySelectedPlayerIds.includes(
                                          player._id,
                                        ) || player._id === selectedPlayer,
                                    )
                                    .map((player) => (
                                      <option
                                        key={player._id}
                                        value={player._id}
                                      >
                                        {player.name} ({player.position})
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                    {/* subs */}
                    {formData.playersPerTeam && formData.awayTeam && (
                      <div className="mt-6">
                        <h2 className="mb-1 text-xl font-bold text-secondary ">
                          Away Substitutes (Optional)
                        </h2>

                        <div className="grid gap-4 grid-cols-1">
                          {formData.awaySubstitutes.map(
                            (selectedPlayer, index) => (
                              <div key={index}>
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
                                  className="w-full rounded-lg border border-[#28466B] bg-card px-4 py-3 text-[#F8FAFC]"
                                >
                                  <option value="">Select substitute</option>
                                  {/* awayTeamPlayers */}
                                  {awayTeamPlayers
                                    .filter(
                                      (player) =>
                                        !awaySelectedPlayerIds.includes(
                                          player._id,
                                        ) || player._id === selectedPlayer,
                                    )
                                    .map((player) => (
                                      <option
                                        key={player._id}
                                        value={player._id}
                                      >
                                        {player.name} ({player.position})
                                      </option>
                                    ))}
                                </select>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-[#28466B]" />

            {/* Submit */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    homeTeam: "",
                    awayTeam: "",
                    playersPerTeam: "",
                    matchTime: "",
                    matchType: "",
                    matchSchedule: "",

                    homeStartingPlayers: [],
                    homeSubstitutes: [],

                    awayStartingPlayers: [],
                    awaySubstitutes: [],
                  })
                }
                className="rounded-xl border border-[#28466B] px-6 py-3 font-semibold text-[#B8C2D1] transition hover:border-[#3A82FF] hover:text-white"
              >
                Clear
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#0E5FD8] px-6 py-3 font-semibold text-white transition hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Match..." : "Create Match"}
              </button>
            </div>
          </form>
          {message && (
            <div
              className={`mt-6 rounded-xl border px-4 py-3 text-sm ${
                message.includes("successfully")
                  ? "border-[#49C85A]/30 bg-[#49C85A]/10 text-[#49C85A]"
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

export default NewMatch;

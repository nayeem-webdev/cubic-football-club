import { useMemo } from "react";
import { X, ChevronLeft, ChevronRight, Goal, Handshake } from "lucide-react";

const GoalModal = ({
  goalModal,
  goalStep,
  goalData,
  selectedMatch,
  setGoalData,
  setGoalStep,
  closeGoalModal,
  saveGoal,
}) => {
  const selectedTeamPlayers = useMemo(() => {
    if (!goalData.team || !selectedMatch) return [];

    const startingPlayers =
      goalData.team === "home"
        ? selectedMatch.homeStartingPlayers
        : selectedMatch.awayStartingPlayers;

    const substitutes =
      goalData.team === "home"
        ? selectedMatch.homeSubstitutes
        : selectedMatch.awaySubstitutes;

    return [...(startingPlayers || []), ...(substitutes || [])];
  }, [goalData.team, selectedMatch]);

  // Find scorer
  const scorer = selectedTeamPlayers.find(
    (player) => player._id === goalData.scorer,
  );

  // Don't render if modal is closed
  if (!goalModal) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeGoalModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#28466B] bg-[#152640] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex items-center justify-between border-b border-[#28466B] px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#49C85A]/10 text-[#49C85A]">
                <Goal size={18} />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-[#49C85A]">
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#F8FAFC]">Record Goal</h2>
          </div>

          <button
            onClick={closeGoalModal}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#B8C2D1] transition-all hover:bg-[#28466B] hover:text-[#F8FAFC]"
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================= */}
        {/* STEP INDICATOR */}
        {/* ========================================= */}

        <div className="border-b border-[#28466B] px-6 py-4">
          <div className="flex items-center justify-between">
            {["team", "scorer", "actions", "assist"].map((step, index) => {
              const steps = ["team", "scorer", "actions", "assist"];

              const currentIndex = steps.indexOf(goalStep);
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              return (
                <div
                  key={step}
                  className="flex flex-1 items-center last:flex-none"
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-[#0E5FD8] text-white"
                        : isCompleted
                          ? "bg-[#49C85A] text-white"
                          : "bg-[#0E1D34] text-[#B8C2D1]"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {index < 3 && (
                    <div
                      className={`mx-2 h-[2px] flex-1 ${
                        index < currentIndex ? "bg-[#49C85A]" : "bg-[#28466B]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================= */}
        {/* CONTENT */}
        {/* ========================================= */}

        <div className="p-6">
          {/* ================= TEAM ================= */}

          {goalStep === "team" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Which team scored?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the team that scored the goal.
              </p>

              <div className="mt-6 space-y-3">
                {/* HOME TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    goalData.team === "home"
                      ? "border-[#0E5FD8] bg-[#0E5FD8]/10"
                      : "border-[#28466B] bg-[#0E1D34] hover:border-[#3A82FF]"
                  }`}
                >
                  <div>
                    <p className="text-xs text-[#B8C2D1]">HOME TEAM</p>

                    <p className="mt-1 font-semibold text-[#F8FAFC]">
                      {selectedMatch.homeTeam.name}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="goalTeam"
                    value="home"
                    checked={goalData.team === "home"}
                    onChange={(e) =>
                      setGoalData((prev) => ({
                        ...prev,
                        team: e.target.value,
                      }))
                    }
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>

                {/* AWAY TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    goalData.team === "away"
                      ? "border-[#0E5FD8] bg-[#0E5FD8]/10"
                      : "border-[#28466B] bg-[#0E1D34] hover:border-[#3A82FF]"
                  }`}
                >
                  <div>
                    <p className="text-xs text-[#B8C2D1]">AWAY TEAM</p>

                    <p className="mt-1 font-semibold text-[#F8FAFC]">
                      {selectedMatch.awayTeam.name}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="goalTeam"
                    value="away"
                    checked={goalData.team === "away"}
                    onChange={(e) =>
                      setGoalData((prev) => ({
                        ...prev,
                        team: e.target.value,
                      }))
                    }
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  disabled={!goalData.team}
                  onClick={() => setGoalStep("scorer")}
                  className="flex items-center gap-2 rounded-xl bg-[#0E5FD8] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================= SCORER ================= */}

          {goalStep === "scorer" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Who scored?</h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the player who scored the goal.
              </p>

              <div className="mt-6 space-y-2">
                {selectedTeamPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      goalData.scorer === player._id
                        ? "border-[#49C85A] bg-[#49C85A]/10"
                        : "border-[#28466B] bg-[#0E1D34] hover:border-[#49C85A]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#28466B] text-xs font-bold text-[#F8FAFC]">
                        #{player.jerseyNumber}
                      </div>

                      <p className="font-medium text-[#F8FAFC]">
                        {player.name}
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="scorer"
                      value={player._id}
                      checked={goalData.scorer === player._id}
                      onChange={(e) =>
                        setGoalData((prev) => ({
                          ...prev,
                          scorer: e.target.value,
                        }))
                      }
                      className="h-4 w-4 accent-[#49C85A]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setGoalStep("team")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  disabled={!goalData.scorer}
                  onClick={() => setGoalStep("actions")}
                  className="flex items-center gap-2 rounded-xl bg-[#0E5FD8] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#3A82FF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Confirm
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* ================= ACTIONS ================= */}

          {goalStep === "actions" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Goal Details</h3>

              {/* Selected Scorer */}

              <div className="mt-5 rounded-2xl border border-[#49C85A]/30 bg-[#49C85A]/10 p-4">
                <p className="text-xs font-semibold tracking-wider text-[#49C85A]">
                  GOAL SCORER
                </p>

                <p className="mt-2 text-lg font-bold text-[#F8FAFC]">
                  {scorer?.name}
                </p>

                <p className="text-sm text-[#B8C2D1]">
                  #{scorer?.jerseyNumber}
                </p>
              </div>

              {/* Action Buttons */}

              <div className="mt-5 grid gap-3">
                <button
                  onClick={() => setGoalStep("assist")}
                  className="flex items-center justify-between rounded-2xl border border-[#28466B] bg-[#0E1D34] p-4 text-left transition-all hover:border-[#D4AF37]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                      <Handshake size={20} />
                    </div>

                    <div>
                      <p className="font-semibold text-[#F8FAFC]">Add Assist</p>

                      <p className="text-xs text-[#B8C2D1]">
                        Select the assisting player
                      </p>
                    </div>
                  </div>

                  <ChevronRight size={18} className="text-[#B8C2D1]" />
                </button>

                <button
                  onClick={saveGoal}
                  className="rounded-2xl bg-[#49C85A] p-4 font-bold text-[#07111F] transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(73,200,90,0.25)]"
                >
                  SAVE GOAL
                </button>
              </div>

              <button
                onClick={() => setGoalStep("scorer")}
                className="mt-5 flex items-center gap-2 text-sm font-medium text-[#B8C2D1] transition hover:text-[#F8FAFC]"
              >
                <ChevronLeft size={18} />
                Change Scorer
              </button>
            </div>
          )}

          {/* ================= ASSIST ================= */}

          {goalStep === "assist" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Assisted by</h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the player who provided the assist.
              </p>

              <div className="mt-6 space-y-2">
                {/* NO ASSIST */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                    goalData.assister === ""
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-[#28466B] bg-[#0E1D34]"
                  }`}
                >
                  <p className="font-medium text-[#F8FAFC]">No Assist</p>

                  <input
                    type="radio"
                    name="assist"
                    value=""
                    checked={goalData.assister === ""}
                    onChange={() =>
                      setGoalData((prev) => ({
                        ...prev,
                        assister: "",
                      }))
                    }
                    className="h-4 w-4 accent-[#D4AF37]"
                  />
                </label>

                {/* PLAYERS */}

                {selectedTeamPlayers
                  .filter((player) => player._id !== goalData.scorer)
                  .map((player) => (
                    <label
                      key={player._id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                        goalData.assister === player._id
                          ? "border-[#D4AF37] bg-[#D4AF37]/10"
                          : "border-[#28466B] bg-[#0E1D34] hover:border-[#D4AF37]/60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#28466B] text-xs font-bold text-[#F8FAFC]">
                          #{player.jerseyNumber}
                        </div>

                        <p className="font-medium text-[#F8FAFC]">
                          {player.name}
                        </p>
                      </div>

                      <input
                        type="radio"
                        name="assist"
                        value={player._id}
                        checked={goalData.assister === player._id}
                        onChange={(e) =>
                          setGoalData((prev) => ({
                            ...prev,
                            assister: e.target.value,
                          }))
                        }
                        className="h-4 w-4 accent-[#D4AF37]"
                      />
                    </label>
                  ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setGoalStep("actions")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  onClick={saveGoal}
                  className="rounded-xl bg-[#49C85A] px-6 py-3 font-semibold text-[#07111F] transition-all hover:shadow-[0_0_25px_rgba(73,200,90,0.25)]"
                >
                  Save Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalModal;

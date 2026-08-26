import { useMemo } from "react";
import { ChevronLeft, Goal, X } from "lucide-react";

const ModalOwnGoal = ({
  ownGoalModal,
  ownGoalStep,
  setOwnGoalStep,
  ownGoalData,
  selectedMatch,
  setOwnGoalData,
  closeOwnGoalModal,
  saveOwnGoal,
}) => {
  const selectedTeamPlayers = useMemo(() => {
    if (!ownGoalData.team || !selectedMatch) return [];

    const startingPlayers =
      ownGoalData.team === "home"
        ? selectedMatch.homeStartingPlayers
        : selectedMatch.awayStartingPlayers;

    const substitutes =
      ownGoalData.team === "home"
        ? selectedMatch.homeSubstitutes
        : selectedMatch.awaySubstitutes;

    return [...(startingPlayers || []), ...(substitutes || [])];
  }, [ownGoalData.team, selectedMatch]);

  // Don't render if modal is closed
  if (!ownGoalModal) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeOwnGoalModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#28466B] bg-card shadow-2xl"
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

            <h2 className="text-xl font-bold text-[#F8FAFC]">
              Record Own Goal
            </h2>
          </div>

          <button
            onClick={closeOwnGoalModal}
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
            {["team", "player"].map((step, index) => {
              const steps = ["team", "player"];

              const currentIndex = steps.indexOf(ownGoalStep);
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

                  {index < 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
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

          {ownGoalStep === "team" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Which team conceded the own goal?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the team whose player scored the own goal.
              </p>

              <div className="mt-6 space-y-3">
                {/* HOME TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    ownGoalData.team === "home"
                      ? "border-[#49C85A] bg-[#49C85A]/10"
                      : "border-[#28466B] bg-[#0E1D34] hover:border-[#49C85A]"
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
                    name="ownGoalTeam"
                    value="home"
                    checked={ownGoalData.team === "home"}
                    onChange={(e) => {
                      setOwnGoalData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        scorer: "",
                      }));

                      setOwnGoalStep("player");
                    }}
                    className="h-4 w-4 accent-[#49C85A]"
                  />
                </label>

                {/* AWAY TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    ownGoalData.team === "away"
                      ? "border-[#49C85A] bg-[#49C85A]/10"
                      : "border-[#28466B] bg-[#0E1D34] hover:border-[#49C85A]"
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
                    name="ownGoalTeam"
                    value="away"
                    checked={ownGoalData.team === "away"}
                    onChange={(e) => {
                      setOwnGoalData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        scorer: "",
                      }));

                      setOwnGoalStep("player");
                    }}
                    className="h-4 w-4 accent-[#49C85A]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ================= PLAYER ================= */}

          {ownGoalStep === "player" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Who scored the own goal?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the player who accidentally scored into their own net.
              </p>

              <div className="mt-6 space-y-2">
                {selectedTeamPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      ownGoalData.scorer === player._id
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
                      name="ownGoalPlayer"
                      value={player._id}
                      checked={ownGoalData.scorer === player._id}
                      onChange={(e) => {
                        setOwnGoalData((prev) => ({
                          ...prev,
                          scorer: e.target.value,
                        }));
                      }}
                      className="h-4 w-4 accent-[#49C85A]"
                    />
                  </label>
                ))}
              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setOwnGoalStep("team")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  onClick={saveOwnGoal}
                  disabled={!ownGoalData.team || !ownGoalData.scorer}
                  className="rounded-xl bg-[#49C85A] py-3 px-4 font-bold text-[#07111F] transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  SAVE OWN GOAL
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalOwnGoal;

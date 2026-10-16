import { useMemo } from "react";
import { ChevronLeft, Goal, X } from "lucide-react";

const ModalPenalty = ({
  penaltyModal,
  penaltyStep,
  setPenaltyStep,
  penaltyData,
  selectedMatch,
  setPenaltyData,
  closePenaltyModal,
  savePenalty,
}) => {
  const selectedTeamPlayers = useMemo(() => {
    if (!penaltyData.team || !selectedMatch) return [];

    const startingPlayers =
      penaltyData.team === "home"
        ? selectedMatch.homeStartingPlayers
        : selectedMatch.awayStartingPlayers;

    const substitutes =
      penaltyData.team === "home"
        ? selectedMatch.homeSubstitutes
        : selectedMatch.awaySubstitutes;

    return [...(startingPlayers || []), ...(substitutes || [])];
  }, [penaltyData.team, selectedMatch]);

  // Don't render if modal is closed
  if (!penaltyModal) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closePenaltyModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================= */}
        {/* HEADER */}
        {/* ========================================= */}

        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#49C85A]/10 text-[#49C85A]">
                <Goal size={18} />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-[#49C85A]">
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-text">Record Penalty</h2>
          </div>

          <button
            onClick={closePenaltyModal}
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all hover:bg-surface hover:text-text"
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================= */}
        {/* STEP INDICATOR */}
        {/* ========================================= */}

        <div className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            {["team", "scorer"].map((step, index) => {
              const steps = ["team", "scorer"];

              const currentIndex = steps.indexOf(penaltyStep);
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
                        ? "bg-primary text-white"
                        : isCompleted
                          ? "bg-[#49C85A] text-white"
                          : "text-muted text-muted"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {index < 1 && (
                    <div
                      className={`mx-2 h-0.5 flex-1 ${
                        index < currentIndex ? "bg-[#49C85A]" : "bg-surface"
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

          {penaltyStep === "team" && (
            <div>
              <h3 className="text-lg font-bold text-text">
                Which team took the penalty?
              </h3>

              <div className="mt-6 space-y-3">
                {/* HOME TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    penaltyData.team === "home"
                      ? "border-[#0E5FD8] bg-primary/10"
                      : "border-border text-muted hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12">
                      <img src={selectedMatch.homeTeam.logoLow} alt="" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">HOME TEAM</p>

                      <p className="mt-1 font-semibold text-text">
                        {selectedMatch.homeTeam.name}
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="penaltyTeam"
                    value="home"
                    checked={penaltyData.team === "home"}
                    onChange={(e) => {
                      setPenaltyData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        scorer: "",
                      }));

                      setPenaltyStep("scorer");
                    }}
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>

                {/* AWAY TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    penaltyData.team === "away"
                      ? "border-[#0E5FD8] bg-primary/10"
                      : "border-border text-muted hover:border-secondary"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12">
                      <img src={selectedMatch.awayTeam.logoLow} alt="" />
                    </div>
                    <div>
                      <p className="text-xs text-muted">AWAY TEAM</p>

                      <p className="mt-1 font-semibold text-text">
                        {selectedMatch.awayTeam.name}
                      </p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="penaltyTeam"
                    value="away"
                    checked={penaltyData.team === "away"}
                    onChange={(e) => {
                      setPenaltyData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        scorer: "",
                      }));

                      setPenaltyStep("scorer");
                    }}
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ================= SCORER ================= */}

          {penaltyStep === "scorer" && (
            <div>
              <h3 className="text-lg font-bold text-text">
                Who scored the penalty?
              </h3>

              <div className="mt-6 space-y-2">
                {selectedTeamPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      penaltyData.scorer === player._id
                        ? "border-secondary bg-[#49C85A]/10"
                        : "border-border text-muted hover:border-secondary/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface">
                        <img
                          src={player.photo}
                          alt={player.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <p className="font-medium text-text">
                        {player.name}{" "}
                        <span className="text-secondary">
                          #{player.jerseyNumber}{" "}
                        </span>
                      </p>
                    </div>

                    <input
                      type="radio"
                      name="penaltyScorer"
                      value={player._id}
                      checked={penaltyData.scorer === player._id}
                      onChange={(e) => {
                        setPenaltyData((prev) => ({
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
                  onClick={() => setPenaltyStep("team")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-muted transition hover:text-muted hover:text-text"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  onClick={savePenalty}
                  disabled={!penaltyData.team || !penaltyData.scorer}
                  className="rounded-xl bg-[#49C85A] py-3 px-4 font-bold text-[#07111F] transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(73,200,90,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  SAVE PENALTY
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPenalty;

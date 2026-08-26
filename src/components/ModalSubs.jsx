import { useMemo } from "react";
import { ChevronLeft, UsersRound, X } from "lucide-react";

const ModalSubs = ({
  subsModal,
  subsStep,
  setSubsStep,
  subsData,
  selectedMatch,
  setSubsData,
  closeSubsModal,
  saveSubs,
}) => {
  // =========================================
  // PLAYERS WHO CAN COME OUT
  // =========================================

  const playersOut = useMemo(() => {
    if (!subsData.team || !selectedMatch) return [];

    return subsData.team === "home"
      ? selectedMatch.homeStartingPlayers || []
      : selectedMatch.awayStartingPlayers || [];
  }, [subsData.team, selectedMatch]);

  // =========================================
  // PLAYERS WHO CAN COME IN
  // =========================================

  const playersIn = useMemo(() => {
    if (!subsData.team || !selectedMatch) return [];

    return subsData.team === "home"
      ? selectedMatch.homeSubstitutes || []
      : selectedMatch.awaySubstitutes || [];
  }, [subsData.team, selectedMatch]);

  // Don't render if modal is closed
  if (!subsModal) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeSubsModal}
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E5FD8]/10 text-[#3A82FF]">
                <UsersRound size={18} />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-[#3A82FF]">
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#F8FAFC]">
              Record Substitution
            </h2>
          </div>

          <button
            onClick={closeSubsModal}
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
            {["team", "out", "in"].map((step, index) => {
              const steps = ["team", "out", "in"];

              const currentIndex = steps.indexOf(subsStep);
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

                  {index < 2 && (
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

          {subsStep === "team" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Which team made the substitution?
              </h3>

              <div className="mt-6 space-y-3">
                {/* HOME TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    subsData.team === "home"
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
                    name="subsTeam"
                    value="home"
                    checked={subsData.team === "home"}
                    onChange={(e) => {
                      setSubsData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        playerOut: "",
                        playerIn: "",
                      }));

                      setSubsStep("out");
                    }}
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>

                {/* AWAY TEAM */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    subsData.team === "away"
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
                    name="subsTeam"
                    value="away"
                    checked={subsData.team === "away"}
                    onChange={(e) => {
                      setSubsData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        playerOut: "",
                        playerIn: "",
                      }));

                      setSubsStep("out");
                    }}
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ================= PLAYER OUT ================= */}

          {subsStep === "out" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Who is coming off?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the player leaving the pitch.
              </p>

              <div className="mt-6 space-y-2">
                {playersOut.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      subsData.playerOut === player._id
                        ? "border-[#EF4444] bg-[#EF4444]/10"
                        : "border-[#28466B] bg-[#0E1D34] hover:border-[#EF4444]/60"
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
                      name="playerOut"
                      value={player._id}
                      checked={subsData.playerOut === player._id}
                      onChange={(e) => {
                        setSubsData((prev) => ({
                          ...prev,
                          playerOut: e.target.value,
                        }));

                        setSubsStep("in");
                      }}
                      className="h-4 w-4 accent-[#EF4444]"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setSubsStep("team")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ================= PLAYER IN ================= */}

          {subsStep === "in" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Who is coming on?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the substitute entering the pitch.
              </p>

              <div className="mt-6 space-y-2">
                {playersIn
                  .filter((player) => player._id !== subsData.playerOut)
                  .map((player) => (
                    <label
                      key={player._id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                        subsData.playerIn === player._id
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
                        name="playerIn"
                        value={player._id}
                        checked={subsData.playerIn === player._id}
                        onChange={(e) =>
                          setSubsData((prev) => ({
                            ...prev,
                            playerIn: e.target.value,
                          }))
                        }
                        className="h-4 w-4 accent-[#49C85A]"
                      />
                    </label>
                  ))}
              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setSubsStep("out")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  onClick={saveSubs}
                  disabled={
                    !subsData.team || !subsData.playerOut || !subsData.playerIn
                  }
                  className="rounded-xl bg-[#49C85A] px-4 py-3 font-bold text-[#07111F] transition-all hover:scale-[1.01] hover:shadow-[0_0_25px_rgba(73,200,90,0.25)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  SAVE SUBSTITUTION
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalSubs;

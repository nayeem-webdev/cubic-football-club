import { useMemo } from "react";
import { X, CircleDotDashed } from "lucide-react";

const PenaltyModal = ({
  penaltyModal,
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

  if (!penaltyModal) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closePenaltyModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#28466B] bg-[#152640] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#28466B] px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <CircleDotDashed size={18} />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37]">
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#F8FAFC]">Record Penalty</h2>
          </div>

          <button
            onClick={closePenaltyModal}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#B8C2D1] transition-all hover:bg-[#28466B] hover:text-[#F8FAFC]"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {/* ================================= */}
          {/* SELECT TEAM */}
          {/* ================================= */}

          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">
              Which team took the penalty?
            </h3>

            <p className="mt-1 text-sm text-[#B8C2D1]">
              Select the team awarded the penalty.
            </p>

            <div className="mt-5 space-y-3">
              {/* HOME TEAM */}

              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  penaltyData.team === "home"
                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-[#28466B] bg-[#0E1D34] hover:border-[#D4AF37]/60"
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
                  name="penaltyTeam"
                  value="home"
                  checked={penaltyData.team === "home"}
                  onChange={(e) =>
                    setPenaltyData((prev) => ({
                      ...prev,
                      team: e.target.value,
                      player: "",
                    }))
                  }
                  className="h-4 w-4 accent-[#D4AF37]"
                />
              </label>

              {/* AWAY TEAM */}

              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  penaltyData.team === "away"
                    ? "border-[#D4AF37] bg-[#D4AF37]/10"
                    : "border-[#28466B] bg-[#0E1D34] hover:border-[#D4AF37]/60"
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
                  name="penaltyTeam"
                  value="away"
                  checked={penaltyData.team === "away"}
                  onChange={(e) =>
                    setPenaltyData((prev) => ({
                      ...prev,
                      team: e.target.value,
                      player: "",
                    }))
                  }
                  className="h-4 w-4 accent-[#D4AF37]"
                />
              </label>
            </div>
          </div>

          {/* ================================= */}
          {/* SELECT PLAYER */}
          {/* ================================= */}

          {penaltyData.team && (
            <div className="mt-8 border-t border-[#28466B] pt-6">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Who took the penalty?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">
                Select the player who took the penalty.
              </p>

              <div className="mt-5 space-y-2">
                {selectedTeamPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      penaltyData.player === player._id
                        ? "border-[#D4AF37] bg-[#D4AF37]/10"
                        : "border-[#28466B] bg-[#0E1D34] hover:border-[#D4AF37]/60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#28466B] text-xs font-bold text-[#F8FAFC]">
                        #{player.jerseyNumber}
                      </div>

                      <div>
                        <p className="font-medium text-[#F8FAFC]">
                          {player.name}
                        </p>
                      </div>
                    </div>

                    <input
                      type="radio"
                      name="penaltyPlayer"
                      value={player._id}
                      checked={penaltyData.player === player._id}
                      onChange={(e) =>
                        setPenaltyData((prev) => ({
                          ...prev,
                          player: e.target.value,
                        }))
                      }
                      className="h-4 w-4 accent-[#D4AF37]"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ================================= */}
          {/* ACTION BUTTONS */}
          {/* ================================= */}

          <div className="mt-8 flex items-center justify-between border-t border-[#28466B] pt-5">
            <button
              onClick={closePenaltyModal}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
            >
              Cancel
            </button>

            <button
              onClick={savePenalty}
              disabled={!penaltyData.team || !penaltyData.player}
              className="rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#07111F] transition-all hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              SAVE PENALTY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PenaltyModal;

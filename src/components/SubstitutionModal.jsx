import { useMemo } from "react";
import {
  X,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
} from "lucide-react";

const SubstitutionModal = ({
  substitutionModal,
  substitutionData,
  selectedMatch,
  setSubstitutionData,
  closeSubstitutionModal,
  saveSubstitution,
}) => {
  if (!substitutionModal) return null;

  // Get selected team's starting players
  const startingPlayers = useMemo(() => {
    if (!substitutionData.team || !selectedMatch) return [];

    return substitutionData.team === "home"
      ? selectedMatch.homeStartingPlayers || []
      : selectedMatch.awayStartingPlayers || [];
  }, [substitutionData.team, selectedMatch]);

  // Get selected team's substitutes
  const substitutes = useMemo(() => {
    if (!substitutionData.team || !selectedMatch) return [];

    return substitutionData.team === "home"
      ? selectedMatch.homeSubstitutes || []
      : selectedMatch.awaySubstitutes || [];
  }, [substitutionData.team, selectedMatch]);

  // Selected player OUT
  const selectedPlayerOut = startingPlayers.find(
    (player) => player._id === substitutionData.playerOut,
  );

  // Selected player IN
  const selectedPlayerIn = substitutes.find(
    (player) => player._id === substitutionData.playerIn,
  );

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeSubstitutionModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#28466B] bg-[#152640] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#28466B] px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E5FD8]/10 text-[#3A82FF]">
                <ArrowLeftRight size={18} />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-[#3A82FF]">
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#F8FAFC]">Substitution</h2>
          </div>

          <button
            onClick={closeSubstitutionModal}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#B8C2D1] transition hover:bg-[#28466B] hover:text-[#F8FAFC]"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* TEAM */}
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Select Team</h3>

            <div className="mt-4 space-y-3">
              {/* HOME */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  substitutionData.team === "home"
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
                  name="subTeam"
                  value="home"
                  checked={substitutionData.team === "home"}
                  onChange={(e) =>
                    setSubstitutionData((prev) => ({
                      ...prev,
                      team: e.target.value,
                      playerOut: "",
                      playerIn: "",
                    }))
                  }
                  className="h-4 w-4 accent-[#0E5FD8]"
                />
              </label>

              {/* AWAY */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  substitutionData.team === "away"
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
                  name="subTeam"
                  value="away"
                  checked={substitutionData.team === "away"}
                  onChange={(e) =>
                    setSubstitutionData((prev) => ({
                      ...prev,
                      team: e.target.value,
                      playerOut: "",
                      playerIn: "",
                    }))
                  }
                  className="h-4 w-4 accent-[#0E5FD8]"
                />
              </label>
            </div>
          </div>

          {/* PLAYER OUT */}
          {substitutionData.team && (
            <div className="mt-7 border-t border-[#28466B] pt-6">
              <div className="flex items-center gap-2">
                <ArrowDownToLine size={18} className="text-red-400" />

                <h3 className="text-lg font-bold text-[#F8FAFC]">Player Out</h3>
              </div>

              <div className="mt-4 space-y-2">
                {startingPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      substitutionData.playerOut === player._id
                        ? "border-red-400 bg-red-400/10"
                        : "border-[#28466B] bg-[#0E1D34] hover:border-red-400/60"
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
                      checked={substitutionData.playerOut === player._id}
                      onChange={(e) =>
                        setSubstitutionData((prev) => ({
                          ...prev,
                          playerOut: e.target.value,
                        }))
                      }
                      className="h-4 w-4 accent-red-400"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* PLAYER IN */}
          {substitutionData.team && (
            <div className="mt-7 border-t border-[#28466B] pt-6">
              <div className="flex items-center gap-2">
                <ArrowUpFromLine size={18} className="text-[#49C85A]" />

                <h3 className="text-lg font-bold text-[#F8FAFC]">Player In</h3>
              </div>

              <div className="mt-4 space-y-2">
                {substitutes.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      substitutionData.playerIn === player._id
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
                      checked={substitutionData.playerIn === player._id}
                      onChange={(e) =>
                        setSubstitutionData((prev) => ({
                          ...prev,
                          playerIn: e.target.value,
                        }))
                      }
                      className="h-4 w-4 accent-[#49C85A]"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SUBSTITUTION PREVIEW */}
          {selectedPlayerOut && selectedPlayerIn && (
            <div className="mt-6 rounded-2xl border border-[#28466B] bg-[#0E1D34] p-4">
              <p className="mb-3 text-xs font-bold tracking-wider text-[#B8C2D1]">
                SUBSTITUTION SUMMARY
              </p>

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-red-400">OUT</p>

                  <p className="font-semibold text-[#F8FAFC]">
                    {selectedPlayerOut.name}
                  </p>
                </div>

                <ArrowLeftRight size={20} className="text-[#3A82FF]" />

                <div className="text-right">
                  <p className="text-xs font-semibold text-[#49C85A]">IN</p>

                  <p className="font-semibold text-[#F8FAFC]">
                    {selectedPlayerIn.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div className="mt-8 flex items-center justify-between border-t border-[#28466B] pt-5">
            <button
              onClick={closeSubstitutionModal}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
            >
              CANCEL
            </button>

            <button
              onClick={saveSubstitution}
              disabled={
                !substitutionData.team ||
                !substitutionData.playerOut ||
                !substitutionData.playerIn
              }
              className="rounded-xl bg-[#0E5FD8] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[#3A82FF] hover:shadow-[0_0_25px_rgba(14,95,216,0.3)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              SAVE SUBSTITUTION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubstitutionModal;

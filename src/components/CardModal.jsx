import { useMemo } from "react";
import { X, Square } from "lucide-react";

const CardModal = ({
  cardModal,
  cardData,
  selectedMatch,
  setCardData,
  closeCardModal,
  saveCard,
}) => {
  if (!cardModal) return null;

  const isYellow = cardData.type === "yellow";

  const selectedTeamPlayers = useMemo(() => {
    if (!cardData.team || !selectedMatch) return [];

    const startingPlayers =
      cardData.team === "home"
        ? selectedMatch.homeStartingPlayers
        : selectedMatch.awayStartingPlayers;

    const substitutes =
      cardData.team === "home"
        ? selectedMatch.homeSubstitutes
        : selectedMatch.awaySubstitutes;

    return [...(startingPlayers || []), ...(substitutes || [])];
  }, [cardData.team, selectedMatch]);

  const cardColor = isYellow ? "#D4AF37" : "#EF4444";

  const cardTypeName = isYellow ? "Yellow Card" : "Red Card";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeCardModal}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl border border-[#28466B] bg-[#152640] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#28466B] px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{
                  backgroundColor: `${cardColor}1A`,
                  color: cardColor,
                }}
              >
                <Square size={16} fill={cardColor} />
              </div>

              <span
                className="text-xs font-bold tracking-[0.2em]"
                style={{ color: cardColor }}
              >
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#F8FAFC]">
              Record {cardTypeName}
            </h2>
          </div>

          <button
            onClick={closeCardModal}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#B8C2D1] transition-all hover:bg-[#28466B] hover:text-[#F8FAFC]"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6">
          {/* CARD TYPE */}
          <div
            className="mb-6 flex items-center gap-4 rounded-2xl border p-4"
            style={{
              borderColor: `${cardColor}4D`,
              backgroundColor: `${cardColor}12`,
            }}
          >
            <div
              className="h-12 w-8 rounded-md shadow-lg"
              style={{
                backgroundColor: cardColor,
              }}
            />

            <div>
              <p
                className="text-xs font-bold tracking-wider"
                style={{ color: cardColor }}
              >
                CARD TYPE
              </p>

              <p className="mt-1 font-semibold text-[#F8FAFC]">
                {cardTypeName}
              </p>
            </div>
          </div>

          {/* TEAM SELECTION */}
          <div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">
              Which team received the card?
            </h3>

            <p className="mt-1 text-sm text-[#B8C2D1]">
              Select the team of the player.
            </p>

            <div className="mt-5 space-y-3">
              {/* HOME TEAM */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  cardData.team === "home"
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
                  name="cardTeam"
                  value="home"
                  checked={cardData.team === "home"}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      team: e.target.value,
                      player: "",
                    }))
                  }
                  className="h-4 w-4 accent-[#0E5FD8]"
                />
              </label>

              {/* AWAY TEAM */}
              <label
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  cardData.team === "away"
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
                  name="cardTeam"
                  value="away"
                  checked={cardData.team === "away"}
                  onChange={(e) =>
                    setCardData((prev) => ({
                      ...prev,
                      team: e.target.value,
                      player: "",
                    }))
                  }
                  className="h-4 w-4 accent-[#0E5FD8]"
                />
              </label>
            </div>
          </div>

          {/* PLAYER SELECTION */}
          {cardData.team && (
            <div className="mt-8 border-t border-[#28466B] pt-6">
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Which player received the card?
              </h3>

              <p className="mt-1 text-sm text-[#B8C2D1]">Select the player.</p>

              <div className="mt-5 space-y-2">
                {selectedTeamPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      cardData.player === player._id
                        ? "border-[#0E5FD8] bg-[#0E5FD8]/10"
                        : "border-[#28466B] bg-[#0E1D34] hover:border-[#3A82FF]"
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
                      name="cardPlayer"
                      value={player._id}
                      checked={cardData.player === player._id}
                      onChange={(e) =>
                        setCardData((prev) => ({
                          ...prev,
                          player: e.target.value,
                        }))
                      }
                      className="h-4 w-4 accent-[#0E5FD8]"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div className="mt-8 flex items-center justify-between border-t border-[#28466B] pt-5">
            <button
              onClick={closeCardModal}
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
            >
              Cancel
            </button>

            <button
              onClick={saveCard}
              disabled={!cardData.team || !cardData.player}
              className="rounded-xl px-6 py-3 text-sm font-bold text-[#07111F] transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{
                backgroundColor: cardColor,
                boxShadow: `0 0 25px ${cardColor}4D`,
              }}
            >
              SAVE {isYellow ? "YELLOW CARD" : "RED CARD"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;

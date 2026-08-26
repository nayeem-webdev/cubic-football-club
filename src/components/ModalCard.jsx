import { useMemo } from "react";
import { ChevronLeft, X, CreditCard } from "lucide-react";

const ModalCard = ({
  cardModal,
  cardStep,
  setCardStep,
  cardData,
  selectedMatch,
  setCardData,
  closeCardModal,
  saveCard,
}) => {
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

  // Don't render if modal is closed
  if (!cardModal) return null;

  return (
    <div
      className="fixed inset-0 z-1000 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={closeCardModal}
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
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <CreditCard size={18} />
              </div>

              <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37]">
                MATCH EVENT
              </span>
            </div>

            <h2 className="text-xl font-bold text-[#F8FAFC]">Record Card</h2>
          </div>

          <button
            onClick={closeCardModal}
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
            {["team", "card", "player"].map((step, index) => {
              const steps = ["team", "card", "player"];

              const currentIndex = steps.indexOf(cardStep);
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

          {cardStep === "team" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Which team received the card?
              </h3>

              <div className="mt-6 space-y-3">
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
                    onChange={(e) => {
                      setCardData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        card: "",
                        player: "",
                      }));

                      setCardStep("card");
                    }}
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
                    onChange={(e) => {
                      setCardData((prev) => ({
                        ...prev,
                        team: e.target.value,
                        card: "",
                        player: "",
                      }));

                      setCardStep("card");
                    }}
                    className="h-4 w-4 accent-[#0E5FD8]"
                  />
                </label>
              </div>
            </div>
          )}

          {/* ================= CARD TYPE ================= */}

          {cardStep === "card" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                What type of card?
              </h3>

              <div className="mt-6 space-y-3">
                {/* YELLOW CARD */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    cardData.card === "yellow"
                      ? "border-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-[#28466B] bg-[#0E1D34] hover:border-[#D4AF37]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-7 rounded-md bg-[#D4AF37] shadow-sm" />

                    <div>
                      <p className="font-semibold text-[#F8FAFC]">
                        Yellow Card
                      </p>

                      <p className="text-xs text-[#B8C2D1]">Caution</p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="cardType"
                    value="yellow"
                    checked={cardData.card === "yellow"}
                    onChange={(e) => {
                      setCardData((prev) => ({
                        ...prev,
                        card: e.target.value,
                        player: "",
                      }));

                      setCardStep("player");
                    }}
                    className="h-4 w-4 accent-[#D4AF37]"
                  />
                </label>

                {/* RED CARD */}

                <label
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    cardData.card === "red"
                      ? "border-[#EF4444] bg-[#EF4444]/10"
                      : "border-[#28466B] bg-[#0E1D34] hover:border-[#EF4444]/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-7 rounded-md bg-[#EF4444] shadow-sm" />

                    <div>
                      <p className="font-semibold text-[#F8FAFC]">Red Card</p>

                      <p className="text-xs text-[#B8C2D1]">Sending off</p>
                    </div>
                  </div>

                  <input
                    type="radio"
                    name="cardType"
                    value="red"
                    checked={cardData.card === "red"}
                    onChange={(e) => {
                      setCardData((prev) => ({
                        ...prev,
                        card: e.target.value,
                        player: "",
                      }));

                      setCardStep("player");
                    }}
                    className="h-4 w-4 accent-[#EF4444]"
                  />
                </label>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => setCardStep("team")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>
              </div>
            </div>
          )}

          {/* ================= PLAYER ================= */}

          {cardStep === "player" && (
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">
                Who received the card?
              </h3>

              <div className="mt-6 space-y-2">
                {selectedTeamPlayers.map((player) => (
                  <label
                    key={player._id}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                      cardData.player === player._id
                        ? cardData.card === "red"
                          ? "border-[#EF4444] bg-[#EF4444]/10"
                          : "border-[#D4AF37] bg-[#D4AF37]/10"
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
                      name="cardPlayer"
                      value={player._id}
                      checked={cardData.player === player._id}
                      onChange={(e) => {
                        setCardData((prev) => ({
                          ...prev,
                          player: e.target.value,
                        }));
                      }}
                      className={`h-4 w-4 ${
                        cardData.card === "red"
                          ? "accent-[#EF4444]"
                          : "accent-[#D4AF37]"
                      }`}
                    />
                  </label>
                ))}
              </div>

              {/* ACTION BUTTONS */}

              <div className="mt-8 flex items-center justify-between">
                <button
                  onClick={() => setCardStep("card")}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#B8C2D1] transition hover:bg-[#0E1D34] hover:text-[#F8FAFC]"
                >
                  <ChevronLeft size={18} />
                  Back
                </button>

                <button
                  onClick={saveCard}
                  disabled={
                    !cardData.team || !cardData.card || !cardData.player
                  }
                  className={`rounded-xl px-4 py-3 font-bold text-[#07111F] transition-all hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 ${
                    cardData.card === "red" ? "bg-[#EF4444]" : "bg-[#D4AF37]"
                  }`}
                >
                  SAVE CARD
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalCard;

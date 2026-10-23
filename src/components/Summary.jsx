import { useMemo } from "react";

// ==========================================
// FORMAT EVENT TIME
// ==========================================

const formatTime = (seconds) => {
  const value = Number(seconds);

  if (!Number.isFinite(value)) {
    return "0'";
  }

  return `${Math.ceil(value / 60)}'`;
};

export default function Summary({ matchData, match }) {
  // ==========================================
  // 1. RESOLVE DATA
  // ==========================================

  // Supports both:
  // <Summary matchData={match} />
  // <Summary match={match} />

  const data = matchData || match;

  // If data is the complete score object:
  // {
  //   match: {...},
  //   homeTeam: {...},
  //   awayTeam: {...},
  //   matchEvents: [...]
  // }
  //
  // use data.match as the match object.
  //
  // If data is already the match object,
  // use data directly.

  const matchObj = data?.match ? data.match : data;

  // ==========================================
  // 2. GET MATCH EVENTS
  // ==========================================

  const matchEvents = data?.matchEvents || matchObj?.matchEvents || [];

  // ==========================================
  // 3. GET PLAYER NAME
  // ==========================================

  const getPlayerName = (playerId) => {
    if (!playerId || !matchObj) {
      return null;
    }

    const allPlayers = [
      ...(matchObj.homeStartingPlayers || []),
      ...(matchObj.homeSubstitutes || []),
      ...(matchObj.awayStartingPlayers || []),
      ...(matchObj.awaySubstitutes || []),
    ];

    const player = allPlayers.find((player) => {
      if (!player?._id) {
        return false;
      }

      return player._id.toString() === playerId.toString();
    });

    return player?.name || "Unknown Player";
  };

  // ==========================================
  // 4. PROCESS EVENTS
  // ==========================================

  const { homeGoalsGrouped, awayGoalsGrouped, homeCards, awayCards } =
    useMemo(() => {
      const homeGoals = {};
      const awayGoals = {};

      const homeCardsList = [];
      const awayCardsList = [];

      matchEvents.forEach((event) => {
        // ======================================
        // CARDS
        // ======================================

        if (
          event.type === "yellow_card" ||
          event.type === "red_card" ||
          event.type === "card"
        ) {
          const isRedCard =
            event.card === "red" ||
            event.cardType === "red" ||
            event.type === "red_card";

          const playerId = event.player || event.scorer;

          const playerName = getPlayerName(playerId) || "Unknown Player";

          const cardData = {
            id: event.id,
            team: event.team,
            type: event.type,
            cardType: isRedCard ? "red" : "yellow",
            player: playerName,
            minute: formatTime(event.time),
          };

          if (event.team === "home") {
            homeCardsList.push(cardData);
          } else if (event.team === "away") {
            awayCardsList.push(cardData);
          }

          return;
        }

        // ======================================
        // GOALS
        // ======================================

        if (event.type === "goal") {
          const scorerName = getPlayerName(event.scorer) || "Unknown Player";

          const assisterName = event.assister
            ? getPlayerName(event.assister)
            : null;

          const timeFormatted = formatTime(event.time);

          const targetGroup = event.team === "home" ? homeGoals : awayGoals;

          // ====================================
          // CREATE SCORER GROUP
          // ====================================

          if (!targetGroup[scorerName]) {
            targetGroup[scorerName] = {
              scorer: scorerName,
              times: [],
              assists: [],
            };
          }

          // ====================================
          // ADD GOAL TIME
          // ====================================

          targetGroup[scorerName].times.push(timeFormatted);

          // ====================================
          // ADD ASSIST
          // ====================================

          if (assisterName && assisterName !== "Unknown Player") {
            targetGroup[scorerName].assists.push({
              assister: assisterName,
              time: timeFormatted,
            });
          }
        }
      });

      return {
        homeGoalsGrouped: Object.values(homeGoals),

        awayGoalsGrouped: Object.values(awayGoals),

        homeCards: homeCardsList,

        awayCards: awayCardsList,
      };

      // getPlayerName intentionally uses
      // the current match roster.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

  // ==========================================
  // 5. NO EVENTS
  // ==========================================

  if (!matchEvents.length) {
    return (
      <p
        className="py-6 text-center text-sm"
        style={{
          color: "var(--color-text-text-muted, #a1a1aa)",
        }}
      >
        No match events
      </p>
    );
  }

  // ==========================================
  // 6. CHECK CARDS
  // ==========================================

  const hasCards = homeCards.length > 0 || awayCards.length > 0;

  // ==========================================
  // 7. RENDER
  // ==========================================

  return (
    <div className="mt-4">
      {/* ====================================== */}
      {/* GOALS TIMELINE */}
      {/* ====================================== */}

      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        {/* ================================== */}
        {/* HOME GOALS */}
        {/* ================================== */}

        <div className="space-y-2 text-left">
          {homeGoalsGrouped.map((item, idx) => (
            <div
              key={`${item.scorer}-${idx}`}
              className="flex flex-col items-start text-[10px] lg:text-sm"
            >
              <p className="font-semibold">
                ⚽ {item.scorer}{" "}
                <span className="font-normal text-gray-300">
                  {item.times.join(", ")}
                </span>
              </p>

              {/* ASSISTS */}

              {item.assists.map((ast, aIdx) => (
                <p
                  key={`${ast.assister}-${aIdx}`}
                  className="mt-0.5 flex items-center justify-start gap-1 text-text-muted"
                >
                  👟 {ast.assister} ({ast.time})
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* ================================== */}
        {/* CENTER BALL */}
        {/* ================================== */}

        <div className="flex h-full items-center justify-center">
          <span className="text-[10px] lg:text-sm">⚽</span>
        </div>

        {/* ================================== */}
        {/* AWAY GOALS */}
        {/* ================================== */}

        <div className="space-y-2 text-right">
          {awayGoalsGrouped.map((item, idx) => (
            <div
              key={`${item.scorer}-${idx}`}
              className="flex flex-col items-end text-[10px] lg:text-sm"
            >
              <p className="font-semibold">
                {item.scorer}{" "}
                <span className="font-normal text-gray-300">
                  {item.times.join(", ")} ⚽
                </span>
              </p>

              {/* ASSISTS */}

              {item.assists.map((ast, aIdx) => (
                <p
                  key={`${ast.assister}-${aIdx}`}
                  className="mt-0.5 flex items-center justify-end gap-1 text-text-muted"
                >
                  {ast.assister} ({ast.time}) 👟
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ====================================== */}
      {/* CARDS SECTION */}
      {/* ====================================== */}

      {hasCards && (
        <div className="mt-6 border-t border-gray-700/60 pt-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
            {/* ================================== */}
            {/* HOME CARDS */}
            {/* ================================== */}

            <div className="space-y-2 text-left">
              {homeCards.map((card) => {
                const isRed = card.cardType === "red";

                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-start gap-1.5 text-[10px] font-semibold lg:text-sm"
                  >
                    {/* CARD */}

                    <span
                      className={`inline-block h-3.5 w-2.5 shrink-0 rounded-xs ${
                        isRed ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    />

                    {/* PLAYER */}

                    <span>{card.player}</span>

                    {/* TIME */}

                    <span className="font-normal text-gray-300">
                      {card.minute}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ================================== */}
            {/* CENTER CARD */}
            {/* ================================== */}

            <div className="flex h-full items-center justify-center">
              <span className="text-[10px] lg:text-sm">🟨</span>
            </div>

            {/* ================================== */}
            {/* AWAY CARDS */}
            {/* ================================== */}

            <div className="space-y-2 text-right">
              {awayCards.map((card) => {
                const isRed = card.cardType === "red";

                return (
                  <div
                    key={card.id}
                    className="flex items-center justify-end gap-1.5 text-[10px] font-semibold lg:text-sm"
                  >
                    {/* TIME */}

                    <span className="font-normal text-gray-300">
                      {card.minute}
                    </span>

                    {/* PLAYER */}

                    <span>{card.player}</span>

                    {/* CARD */}

                    <span
                      className={`inline-block h-3.5 w-2.5 shrink-0 rounded-xs ${
                        isRed ? "bg-red-500" : "bg-yellow-400"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

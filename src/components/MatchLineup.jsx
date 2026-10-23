const MatchLineup = ({ selectedMatch }) => {
  if (!selectedMatch) return null;
  const homeStartingPlayers = selectedMatch.homeStartingPlayers || [];
  const awayStartingPlayers = selectedMatch.awayStartingPlayers || [];

  const homeSubstitutes = selectedMatch.homeSubstitutes || [];
  const awaySubstitutes = selectedMatch.awaySubstitutes || [];

  return (
    <div className="mt-5 rounded-2xl bg-card text-text-muted p-4">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-bold text-text sm:text-base">
          Match Lineup
        </h2>

        <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted/40">
          {selectedMatch?.matchSchedule?.matchFormat ||
            selectedMatch.homeStartingPlayers.length}{" "}
          v{" "}
          {selectedMatch?.matchSchedule?.matchFormat ||
            selectedMatch.awayStartingPlayers.length}{" "}
        </span>
      </div>

      {/* ========================================= */}
      {/* TEAM HEADER */}
      {/* ========================================= */}

      <div className="grid grid-cols-2">
        {/* HOME */}
        <div className="flex items-center gap-2.5 px-4 ">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full">
            <img
              src={selectedMatch.homeTeam.logoLow}
              alt={selectedMatch.homeTeam.name}
              className="h-full w-full object-contain"
            />
          </div>

          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#49C85A]">
              HOME
            </p>

            <p className="truncate text-xs font-semibold text-text sm:text-sm">
              {selectedMatch.homeTeam.name}
            </p>
          </div>
        </div>

        {/* AWAY */}
        <div className="flex items-center justify-end gap-2.5 px-4 text-right">
          <div className="min-w-0">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-[#49C85A]">
              AWAY
            </p>

            <p className="truncate text-xs font-semibold text-text sm:text-sm">
              {selectedMatch.awayTeam.name}
            </p>
          </div>

          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <img
              src={selectedMatch.awayTeam.logoLow}
              alt={selectedMatch.awayTeam.name}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* STARTING PLAYERS */}
      {/* ========================================= */}

      <div className="px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center justify-center">
          <span className="rounded-full bg-background px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted/80">
            Starting Players
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
          {/* HOME */}

          <div className="space-y-2">
            {homeStartingPlayers.map((player) => (
              <PlayerRow key={player._id} player={player} side="home" />
            ))}
          </div>

          {/* AWAY */}

          <div className="space-y-2">
            {awayStartingPlayers.map((player) => (
              <PlayerRow key={player._id} player={player} side="away" />
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* SUBSTITUTES */}
        {/* ========================================= */}

        {(homeSubstitutes.length > 0 || awaySubstitutes.length > 0) && (
          <div className="mt-6 border-t border-border pt-4">
            <div className="mb-3 flex items-center justify-center">
              <span className="rounded-full bg-background px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted/40">
                Substitutes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
              {/* HOME SUBS */}

              <div className="space-y-2">
                {homeSubstitutes.map((player) => (
                  <PlayerRow
                    key={player._id}
                    player={player}
                    side="home"
                    substitute
                  />
                ))}
              </div>

              {/* AWAY SUBS */}

              <div className="space-y-2">
                {awaySubstitutes.map((player) => (
                  <PlayerRow
                    key={player._id}
                    player={player}
                    side="away"
                    substitute
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================= */
/* PLAYER ROW */
/* ========================================= */

const PlayerRow = ({ player, side, substitute = false }) => {
  const isHome = side === "home";

  return (
    <div
      className={`group flex items-center gap-2 rounded-xl border px-2 py-2 transition-all sm:px-2.5 ${
        substitute
          ? "border-border/60 bg-background/30"
          : "border-border bg-background/60 hover:border-secondary/40"
      } ${isHome ? "" : "flex-row-reverse text-right"}`}
    >
      {/* PLAYER PHOTO */}

      <div className="relative shrink-0">
        <div
          className={`h-9 w-9 overflow-hidden rounded-full border bg-surface sm:h-10 sm:w-10 ${
            substitute ? "border-border" : "border-secondary/30"
          }`}
        >
          {player.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-text-muted">
              {player.name?.charAt(0)}
            </div>
          )}
        </div>

        {/* JERSEY NUMBER */}

        <span
          className={`absolute -bottom-1 ${
            isHome ? "-right-1" : "-left-1"
          } flex h-4 min-w-4 items-center justify-center rounded-md border border-[#0E1D34] bg-surface px-1 text-[8px] font-bold text-text`}
        >
          {player.jerseyNumber}
        </span>
      </div>

      {/* PLAYER INFO */}

      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-text sm:text-xs">
          {player.name}
        </p>

        <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-text-muted/40">
          {player.position}
        </p>
      </div>
    </div>
  );
};

export default MatchLineup;

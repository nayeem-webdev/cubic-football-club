const PlayerRow = ({ player, side, substitute = false }) => {
  const isHome = side === "home";

  return (
    <div
      className={`group flex items-center gap-2 rounded-xl border px-2 py-2 transition-all sm:px-2.5 ${
        substitute
          ? "border-[#28466B]/60 bg-[#07111F]/30"
          : "border-[#28466B] bg-[#07111F]/60 hover:border-[#49C85A]/40"
      } ${isHome ? "" : "flex-row-reverse text-right"}`}
    >
      {/* PLAYER PHOTO */}
      <div className="relative shrink-0">
        <div
          className={`h-9 w-9 overflow-hidden rounded-full border bg-[#28466B] sm:h-10 sm:w-10 ${
            substitute ? "border-[#28466B]" : "border-[#49C85A]/30"
          }`}
        >
          {player?.photo ? (
            <img
              src={player.photo}
              alt={player.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[#B8C2D1]">
              {player?.name?.charAt(0)}
            </div>
          )}
        </div>

        {/* JERSEY NUMBER */}
        <span
          className={`absolute -bottom-1 ${
            isHome ? "-right-1" : "-left-1"
          } flex h-4 min-w-4 items-center justify-center rounded-md border border-[#0E1D34] bg-[#28466B] px-1 text-[8px] font-bold text-[#F8FAFC]`}
        >
          {player?.jerseyNumber}
        </span>
      </div>

      {/* PLAYER INFO */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[11px] font-semibold text-[#F8FAFC] sm:text-xs">
          {player?.name}
        </p>
        <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-[#B8C2D1]/40">
          {player?.position}
        </p>
      </div>
    </div>
  );
};

export const Lineup = ({ match }) => {
  const matchObj = match?.match ? match.match : match;

  const homeStarting = matchObj?.homeStartingPlayers || [];
  const awayStarting = matchObj?.awayStartingPlayers || [];
  const homeSubs = matchObj?.homeSubstitutes || [];
  const awaySubs = matchObj?.awaySubstitutes || [];

  return (
    <div className="mt-6 px-4 sm:px-5">
      {/* STARTING PLAYERS */}
      <div className="mb-3 flex items-center justify-center">
        <span className="rounded-full bg-[#07111F] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B8C2D1]/50">
          Starting Players
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
        {/* HOME */}
        <div className="space-y-2">
          {homeStarting.map((player) => (
            <PlayerRow key={player._id} player={player} side="home" />
          ))}
        </div>

        {/* AWAY */}
        <div className="space-y-2">
          {awayStarting.map((player) => (
            <PlayerRow key={player._id} player={player} side="away" />
          ))}
        </div>
      </div>

      {/* SUBSTITUTES */}
      {(homeSubs.length > 0 || awaySubs.length > 0) && (
        <div className="mt-6 border-t border-[#28466B] pt-4">
          <div className="mb-3 flex items-center justify-center">
            <span className="rounded-full bg-[#07111F] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#B8C2D1]/40">
              Substitutes
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6">
            {/* HOME SUBS */}
            <div className="space-y-2">
              {homeSubs.map((player) => (
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
              {awaySubs.map((player) => (
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
  );
};

export default Lineup;

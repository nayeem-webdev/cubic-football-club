import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
  LoaderCircle,
  MapPin,
  Share2,
  Users,
} from "lucide-react";
import { toPng } from "html-to-image";

const API_URL = import.meta.env.VITE_API_URL;

const POSTER_WIDTH = 794;
const POSTER_HEIGHT = 1123;

// ============================================================
// HELPERS
// ============================================================

const getPosition = (player) => {
  return String(
    player?.position || player?.playerPosition || player?.role || "—",
  ).toUpperCase();
};

const formatDate = (dateString) => {
  if (!dateString) return "Date unavailable";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const groupPlayersByPosition = (players = []) => {
  const order = ["GK", "DF", "MF", "ST", "FW"];

  const groups = {};

  order.forEach((position) => {
    groups[position] = [];
  });

  players.forEach((player) => {
    const position = getPosition(player);

    if (!groups[position]) {
      groups[position] = [];
    }

    groups[position].push(player);
  });

  return groups;
};

// ============================================================
// PLAYER CARD
// ============================================================

const PlayerCard = ({ player, variant = "start" }) => {
  const position = getPosition(player);
  const isSub = variant === "sub";

  return (
    <div
      className={`flex min-w-0 items-center gap-[6px] border-b border-white/[0.10] last:border-b-0 ${
        isSub ? "py-[3px]" : "py-[4px]"
      }`}
    >
      {/* Jersey number */}
      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] bg-[#D4AF37] text-[10px] font-[950] text-[#07111F] shadow-[0_2px_5px_rgba(0,0,0,0.25)]">
        {player?.jerseyNumber ?? player?.jersey ?? player?.number ?? "-"}
      </div>

      {/* Player image */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-[#07111F]/80">
        <img
          src={player?.photo}
          alt={player?.name || "Player"}
          crossOrigin="anonymous"
          className="h-full w-full object-contain"
        />
      </div>

      {/* Player name + position */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-bold leading-[1.1] text-[#F8FAFC]">
          {player?.name || "Unknown Player"}
        </p>

        <p className="mt-1 text-[10px] font-medium leading-none text-[#D4AF37]">
          {position}
        </p>
      </div>
    </div>
  );
};

// ============================================================
// POSITION SECTION
// ============================================================

const PositionSection = ({ players, variant = "start" }) => {
  if (!players?.length) return null;

  return (
    <div className="mb-[7px] last:mb-0">
      <div className="flex flex-col">
        {players.map((player, index) => (
          <PlayerCard
            key={player?._id || `player-${index}`}
            player={player}
            variant={variant}
          />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// TEAM PANEL
// ============================================================

const TeamPanel = ({ team, players = [], substitutes = [], side = "home" }) => {
  const isHome = side === "home";

  const groupedPlayers = groupPlayersByPosition(players);
  const positionOrder = ["GK", "DF", "MF", "ST", "FW"];

  return (
    <div
      className={`group relative flex min-w-0 flex-col overflow-hidden rounded-lg border px-[13px] pb-[13px] pt-[14px] backdrop-blur-xl ${
        isHome
          ? "border-[#247DFF]/70 bg-[linear-gradient(145deg,rgba(14,95,216,0.30),rgba(5,18,42,0.48)_48%,rgba(2,8,23,0.60))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(14,95,216,0.16),0_0_20px_rgba(14,95,216,0.12)]"
          : "border-[#D4AF37]/70 bg-[linear-gradient(145deg,rgba(212,175,55,0.24),rgba(45,34,8,0.42)_48%,rgba(2,8,23,0.60))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(212,175,55,0.13),0_0_20px_rgba(212,175,55,0.10)]"
      }`}
    >
      {/* Decorative glass shine */}
      <div
        className={`pointer-events-none absolute left-0 right-0 top-0 h-[2px] ${
          isHome
            ? "bg-gradient-to-r from-transparent via-[#247DFF] to-transparent"
            : "bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"
        }`}
      />

      {/* Decorative corner accent */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
          isHome ? "bg-[#0E5FD8]/20" : "bg-[#D4AF37]/15"
        }`}
      />

      {/* HOME / AWAY BADGE */}
      <div
        className={`relative z-[1] mx-auto min-w-[82px] rounded-[8px] border px-[13px] py-[7px] text-center text-[14px] font-[950] uppercase leading-none tracking-[1px] text-[#F8FAFC] ${
          isHome
            ? "border-[#247DFF]/80 bg-[#071A38]/75 shadow-[0_0_14px_rgba(14,95,216,0.20)]"
            : "border-[#D4AF37]/80 bg-[#2B2108]/75 shadow-[0_0_14px_rgba(212,175,55,0.16)]"
        }`}
      >
        {isHome ? "HOME" : "AWAY"}
      </div>

      {/* TEAM LOGO */}
      <div
        className={`relative mx-auto mb-[8px] mt-3 flex h-[88px] w-[88px] items-center justify-center rounded-full border p-[10px] ${
          isHome
            ? "border-[#247DFF]/45 bg-[#020817]/55 shadow-[0_0_22px_rgba(14,95,216,0.18)]"
            : "border-[#D4AF37]/45 bg-[#020817]/55 shadow-[0_0_22px_rgba(212,175,55,0.14)]"
        }`}
      >
        <div
          className={`absolute inset-[5px] rounded-full border ${
            isHome ? "border-[#247DFF]/15" : "border-[#D4AF37]/15"
          }`}
        />

        <img
          src={team?.logoLow}
          alt={team?.name || "Team"}
          crossOrigin="anonymous"
          className="relative z-[1] h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
        />
      </div>

      {/* TEAM NAME */}
      <h2 className="min-h-[19px] truncate text-center text-[16px] font-[950] uppercase leading-[1.15] tracking-[0.3px] text-[#F8FAFC]">
        {team?.name || "Team"}
      </h2>

      {/* DIVIDER */}
      <div
        className={`mb-[10px] mt-[11px] h-px w-full ${
          isHome
            ? "bg-gradient-to-r from-transparent via-[#247DFF]/60 to-transparent"
            : "bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent"
        }`}
      />

      {/* STARTING PLAYERS HEADING */}
      <div className="mb-[7px] flex items-center justify-between gap-1">
        <div className="flex min-w-0 items-center gap-[6px] whitespace-nowrap text-[8px] font-black tracking-[0.9px] text-[#F8FAFC]">
          <Users
            size={13}
            className={isHome ? "text-[#55A0FF]" : "text-[#D4AF37]"}
          />
          <span>STARTING PLAYERS</span>
        </div>

        <span
          className={`text-[16px] font-[950] ${
            isHome ? "text-[#55A0FF]" : "text-[#D4AF37]"
          }`}
        >
          {players.length}
        </span>
      </div>

      {/* STARTING PLAYERS LIST */}
      <div
        className={`min-h-0 overflow-hidden rounded-[11px] border p-[8px] backdrop-blur-md ${
          isHome
            ? "border-[#247DFF]/20 bg-[#020817]/35"
            : "border-[#D4AF37]/20 bg-[#020817]/35"
        }`}
      >
        {players.length > 0 ? (
          positionOrder.map((position) => (
            <PositionSection
              key={position}
              players={groupedPlayers[position]}
              variant="start"
            />
          ))
        ) : (
          <p className="my-[15px] text-center text-[10px] text-[#B8C2D1]">
            No players listed
          </p>
        )}

        {/* CUSTOM POSITIONS */}
        {Object.entries(groupedPlayers)
          .filter(
            ([position, positionPlayers]) =>
              !positionOrder.includes(position) && positionPlayers.length > 0,
          )
          .map(([position, positionPlayers]) => (
            <PositionSection
              key={position}
              players={positionPlayers}
              variant="start"
            />
          ))}
      </div>

      {/* SUBSTITUTES */}
      {substitutes.length > 0 && (
        <div
          className={`mt-[9px] rounded-[10px] border p-[8px] ${
            isHome
              ? "border-[#247DFF]/20 bg-[#020817]/25"
              : "border-[#D4AF37]/20 bg-[#020817]/25"
          }`}
        >
          <div
            className={`mb-[4px] flex items-center gap-[5px] text-[7px] font-[950] uppercase leading-none tracking-[0.8px] ${
              isHome ? "text-[#55A0FF]" : "text-[#D4AF37]"
            }`}
          >
            <span
              className={`block h-1 w-1 shrink-0 rounded-full ${
                isHome ? "bg-[#55A0FF]" : "bg-[#D4AF37]"
              }`}
            />
            <span>SUBSTITUTES</span>
          </div>

          {substitutes.map((player, index) => (
            <PlayerCard
              key={player?._id || `sub-${index}`}
              player={player}
              variant="sub"
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN COMPONENT
// ============================================================

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const posterRef = useRef(null);

  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  // ============================================================
  // FETCH MATCH
  // ============================================================

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/matches`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch matches");
        }

        if (!Array.isArray(data.matches)) {
          throw new Error("Invalid matches response");
        }

        const selectedMatch = data.matches.find(
          (item) => String(item._id) === String(id),
        );

        if (!selectedMatch) {
          throw new Error("Match not found");
        }

        setMatch(selectedMatch);
      } catch (err) {
        console.error("Match fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  // ============================================================
  // WAIT FOR IMAGES
  // ============================================================

  const waitForImages = async (element) => {
    const images = [...element.querySelectorAll("img")];

    await Promise.all(
      images.map((img) => {
        if (img.complete) {
          return Promise.resolve();
        }

        return new Promise((resolve) => {
          const timeout = setTimeout(resolve, 3000);

          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };

          img.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
      }),
    );
  };

  // ============================================================
  // GENERATE HIGH-QUALITY POSTER
  // ============================================================

  const generatePoster = async () => {
    if (!posterRef.current) {
      throw new Error("Poster not found");
    }

    await document.fonts.ready;
    await waitForImages(posterRef.current);

    // Allow the browser to finish rendering
    await new Promise((resolve) => setTimeout(resolve, 200));

    const EXPORT_SCALE = 4;

    const dataUrl = await toPng(posterRef.current, {
      cacheBust: false,

      // 3x export resolution
      pixelRatio: EXPORT_SCALE,

      backgroundColor: "#07111F",

      // Keep the original poster dimensions
      width: POSTER_WIDTH,
      height: POSTER_HEIGHT,
    });

    return dataUrl;
  };

  // ============================================================
  // DOWNLOAD
  // ============================================================

  const handleDownload = async () => {
    try {
      setGenerating(true);

      const dataUrl = await generatePoster();

      const link = document.createElement("a");
      link.download = "cubic-fc-match-poster.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
    } finally {
      setGenerating(false);
    }
  };

  // ============================================================
  // SHARE
  // ============================================================

  const handleShare = async () => {
    try {
      setGenerating(true);

      const dataUrl = await generatePoster();

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const file = new File([blob], "cubic-fc-match-poster.png", {
        type: "image/png",
      });

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: "CUBIC FC Match Poster",
          text: "CUBIC FC Match Poster",
          files: [file],
        });
      } else {
        const link = document.createElement("a");
        link.download = "cubic-fc-match-poster.png";
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err);
      }
    } finally {
      setGenerating(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817] text-white">
        <div className="flex items-center gap-3 text-[#B8C2D1]">
          <LoaderCircle size={20} className="animate-spin text-[#D4AF37]" />
          Loading match...
        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !match) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817] px-4 text-white">
        <div className="rounded-xl border border-white/10 bg-[#0E1D34] p-8 text-center">
          <h2 className="text-lg font-bold">Match unavailable</h2>

          <p className="mt-2 text-sm text-[#B8C2D1]">
            {error || "Match not found"}
          </p>

          <button
            onClick={() => navigate("/upcoming-matches")}
            className="mt-5 rounded-lg bg-[#0E5FD8] px-5 py-2 text-sm font-bold"
          >
            Back to matches
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // MATCH DATA
  // ============================================================

  const schedule = match.matchSchedule || {};

  const homeTeam = match.homeTeam || {};
  const awayTeam = match.awayTeam || {};

  const homePlayers = match.homeStartingPlayers || [];

  const awayPlayers = match.awayStartingPlayers || [];

  const homeSubstitutes = match.homeSubstitutes || [];

  const awaySubstitutes = match.awaySubstitutes || [];

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="bg-[#020817] text-white">
      {/* ======================================================
          PAGE ACTION BAR
      ====================================================== */}

      <div className="sticky top-0 z-50 border-b border-white/10 bg-[#07111F]/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <button
            onClick={() => navigate("/upcoming-matches")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-50"
            >
              <Download size={15} />
              Download
            </button>

            <button
              onClick={handleShare}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#D4AF37] transition hover:bg-[#D4AF37]/20 disabled:opacity-50"
            >
              <Share2 size={15} />
              {generating ? "Creating..." : "Share"}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================
          POSTER DISPLAY
      ====================================================== */}

      <div className="overflow-x-auto px-0 py-6 sm:px-4">
        <div className="mx-auto w-fit">
          <div
            ref={posterRef}
            className="relative overflow-hidden bg-[#07111F] font-sans text-[#F8FAFC]"
            style={{
              width: POSTER_WIDTH,
              height: POSTER_HEIGHT,
              minWidth: POSTER_WIDTH,
            }}
          >
            {/* ==================================================
                BACKGROUND
            ================================================== */}

            <div className="absolute inset-0 bg-[url('/assets/matchbg.png')] bg-cover bg-center bg-no-repeat" />

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.60)_0%,rgba(2,8,23,0.72)_45%,rgba(2,8,23,0.82)_100%)]" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_35%,rgba(14,95,216,0.36),transparent_42%)]" />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_35%,rgba(212,175,55,0.28),transparent_42%)]" />

            {/* ==================================================
                CONTENT
            ================================================== */}

            <div className="relative z-[2] flex h-full flex-col px-6 pb-[18px] pt-6">
              {/* ==================================================
                  HEADER
              ================================================== */}

              <header className="flex items-center justify-center gap-5">
                <div className="h-60 flex justify-end">
                  <img
                    src="/assets/cubic-fc-logo.png"
                    alt="CUBIC FC"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h2 className="mt-1 text-7xl font-bold uppercase leading-[0.98] tracking-[-1.5px] text-[#F8FAFC]">
                    {schedule.matchType || "FRIENDLY"}
                  </h2>

                  <h2 className="mt-0.5 text-5xl font-bold uppercase leading-none tracking-[-1px] text-[#D4AF37]">
                    {schedule.matchFormat
                      ? `${schedule.matchFormat} VS ${schedule.matchFormat}  FUTSAL MATCH`
                      : "FUTSAL MATCH"}
                  </h2>
                </div>
              </header>

              {/* ==================================================
    TEAMS AREA
================================================== */}

              <div className="relative mt-[17px] grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_64px_minmax(0,1fr)] items-stretch">
                {/* HOME */}
                <TeamPanel
                  team={homeTeam}
                  players={homePlayers}
                  substitutes={homeSubstitutes}
                  side="home"
                />

                {/* CENTER VS ZONE */}
                <div className="relative flex min-w-0 flex-col items-center justify-center">
                  {/* VS badge */}
                  <div className="relative my-[13px] flex h-[420px] w-[140px] shrink-0 items-center justify-center">
                    <img
                      src="/assets/vs.png"
                      alt="VS"
                      className="h-[300px] w-[200px] max-w-none object-fill"
                    />
                  </div>
                </div>

                {/* AWAY */}
                <TeamPanel
                  team={awayTeam}
                  players={awayPlayers}
                  substitutes={awaySubstitutes}
                  side="away"
                />
              </div>

              {/* ==================================================
                  MATCH INFO
              ================================================== */}

              <div className="mt-4 py-2 grid shrink-0 grid-cols-[1fr_1.25fr_1fr] overflow-hidden rounded-lg border-[1.5px] border-[#D4AF37] bg-[rgba(3,12,29,0.94)]">
                {/* Date */}
                <div className="flex min-w-0 items-center gap-[7px] border-r border-[#D4AF37]/45 px-[7px] py-base last:border-r-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[#07111F]">
                    <CalendarDays size={19} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-[3px]">
                    <span className="text-[10px] font-bold uppercase leading-none tracking-[1px] text-[#D4AF37]">
                      DATE
                    </span>
                    <strong className="block truncate text-[12px] font-bold leading-[1.15] text-[#F8FAFC]">
                      {formatDate(schedule.date)}
                    </strong>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex min-w-0 items-center gap-[7px] border-r border-[#D4AF37]/45 px-[7px] py-base last:border-r-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[#07111F]">
                    <MapPin size={19} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-[3px]">
                    <span className="text-[10px] font-bold uppercase leading-none tracking-[1px] text-[#D4AF37]">
                      VENUE
                    </span>
                    <strong className="block truncate text-[12px] font-bold leading-[1.15] text-[#F8FAFC]">
                      {schedule.venue?.venue || "Venue unavailable"}
                    </strong>
                  </div>
                </div>

                {/* Time */}
                <div className="flex min-w-0 items-center gap-[7px] px-[7px] py-base">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37] text-[#07111F]">
                    <Clock3 size={19} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-[3px]">
                    <span className="text-[10px] font-bold uppercase leading-none tracking-[1px] text-[#D4AF37]">
                      TIME
                    </span>
                    <strong className="block truncate text-[12px] font-bold leading-[1.15] text-[#F8FAFC]">
                      {schedule.time || "Time unavailable"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <footer className="mt-[10px] shrink-0 text-center text-[8px] font-extrabold uppercase tracking-[2px] text-[#F8FAFC]/55">
                CUBIC FC • EST. 2012 • CHITTAGONG
              </footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MatchDetails;

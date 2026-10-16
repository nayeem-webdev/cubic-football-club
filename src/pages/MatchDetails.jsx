import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Download,
  MapPin,
  Share2,
  Shirt,
} from "lucide-react";
import { toPng } from "html-to-image";
import Loader from "../components/Loader";

const API_URL = import.meta.env.VITE_API_URL;

const POSTER_WIDTH = 794;
const POSTER_HEIGHT = 1123;

// ============================================================
// HELPERS
// ============================================================

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

// ============================================================
// PLAYER CARD
// ============================================================

const PlayerCard = ({ player }) => {
  return (
    <div className="flex h-11 items-center justify-between border-b border-white/5 py-1.5 last:border-b-0 hover:bg-white/2 px-2 rounded-sm transition-colors">
      {/* Left Section: Jersey, Avatar, and Name */}
      <div className="flex items-center gap-2 min-w-0">
        {/* Clean, low-profile Jersey Tag */}
        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center text-secondary">
          {/* The Icon acts as the backdrop */}
          <Shirt size={20} strokeWidth={2} className="fill-secondary" />

          {/* The Number sits dead center on top of the shirt graphics */}
          <span className="absolute inset-0 flex items-center justify-center pt-0.5 text-[8px] font-bold tracking-tighter text-black">
            {player?.jerseyNumber ?? "-"}
          </span>
        </div>

        {/* Avatar Frame */}
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/3">
          <img
            src={player?.photo}
            alt={player?.name || "Player"}
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Player Name */}
        <span className="truncate text-md font-bold tracking-wide text-text">
          {player?.name || "Unknown Player"}
        </span>
      </div>

      {/* Right Section: Compact Position Pill */}
      <div className="shrink-0 ml-4">
        <span className="inline-flex items-center rounded-sm bg-accent/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent border border-accent/20">
          {player?.position || "N/A"}
        </span>
      </div>
    </div>
  );
};

// ============================================================
// TEAM PANEL
// ============================================================

const TeamPanel = ({ team, players = [], substitutes = [], side = "home" }) => {
  const isHome = side === "home";

  return (
    <div
      className={`group relative flex min-w-0 flex-col rounded-lg border px-3.25 pb-3.25 pt-3.5 backdrop-blur-xl ${
        isHome
          ? "border-[#247DFF]/70 bg-[linear-gradient(145deg,rgba(14,95,216,0.30),rgba(5,18,42,0.48)_48%,rgba(2,8,23,0.60))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(14,95,216,0.16),0_0_20px_rgba(14,95,216,0.12)]"
          : "border-accent/70 bg-[linear-gradient(145deg,rgba(73,200,90,0.24),rgba(20,70,28,0.42)_48%,rgba(2,8,23,0.60))] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),inset_0_0_35px_rgba(73,200,90,0.13),0_0_20px_rgba(73,200,90,0.10)]"
      }`}
    >
      {/* Decorative glass shine */}
      <div
        className={`pointer-events-none absolute left-0 right-0 top-0 h-0.5 ${
          isHome
            ? "bg-linear-to-r from-transparent via-[#247DFF] to-transparent"
            : "bg-linear-to-r from-transparent via-accent to-transparent"
        }`}
      />

      {/* Decorative corner accent */}
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl ${
          isHome ? "bg-primary/20" : "bg-accent/15"
        }`}
      />

      {/* HOME / AWAY BADGE */}
      <div
        className={`relative z-1 -top-10 mx-auto w-fit min-w-45 px-4 py-3 text-center text-2xl font-[950] font-minasans uppercase leading-none tracking-[1px] text-text
    flex items-center justify-center 
    clip-path-[polygon(12%_0%,_88%_0%,_100%_50%,_88%_100%,_12%_100%,_0%_50%)] outline-3 outline-offset-[-6px]
    ${
      isHome
        ? "outline-[#247DFF] bg-[#071A38] shadow-[0_0_14px_rgba(14,95,216,0.20)]"
        : "outline-accent bg-[#082b19] shadow-[0_0_14px_rgba(212,175,55,0.16)]"
    }`}
      >
        {isHome ? "HOME" : "AWAY"}
      </div>

      {/* TEAM LOGO */}
      <div className={`relative mx-auto w-45 -mt-6 mb-1 flex`}>
        <img
          src={team?.logoLow}
          alt={team?.name || "Team"}
          crossOrigin="anonymous"
          className="relative z-[1] h-full w-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)]"
        />
      </div>

      {/* TEAM NAME
      <h2 className="min-h-[19px] truncate text-center text-[16px] font-[950] uppercase leading-[1.15] tracking-[0.3px] text-text">
        {team?.name || "Team"}
      </h2> */}

      {/* DIVIDER */}
      <div
        className={`mb-1 mt-1 h-px w-full ${
          isHome
            ? "bg-gradient-to-r from-transparent via-[#247DFF]/60 to-transparent"
            : "bg-gradient-to-r from-transparent via-accent/60 to-transparent"
        }`}
      />

      {/* STARTING PLAYERS */}
      {players.length > 0 && (
        <div
          className={`mt-2.25 rounded-[10px] border p-2 ${
            isHome
              ? "border-[#247DFF]/20 bg-[#020817]/25"
              : "border-accent/20 bg-[#020817]/25"
          }`}
        >
          <div
            className={`mb-1 flex items-center gap-2 text-[10px] font-minasans uppercase leading-none tracking-[2px] ${
              isHome ? "text-[#55A0FF]" : "text-accent"
            }`}
          >
            <span
              className={`block h-2 w-2 shrink-0 rounded-full ${
                isHome ? "bg-[#55A0FF]" : "bg-accent"
              }`}
            />
            <span>STARTING PLAYERS</span>
          </div>

          {players.map((player, index) => (
            <PlayerCard
              key={player?._id || `sub-${index}`}
              player={player}
              variant="sub"
            />
          ))}
        </div>
      )}
      {/* SUBSTITUTES */}
      {substitutes.length > 0 && (
        <div
          className={`mt-[9px] rounded-[10px] border p-[8px] ${
            isHome
              ? "border-[#247DFF]/20 bg-[#020817]/25"
              : "border-accent/20 bg-[#020817]/25"
          }`}
        >
          <div
            className={`mb-1 flex items-center gap-2 text-[10px] font-minasans uppercase leading-none tracking-[2px] ${
              isHome ? "text-[#55A0FF]" : "text-accent"
            }`}
          >
            <span
              className={`block h-2 w-2 shrink-0 rounded-full ${
                isHome ? "bg-[#55A0FF]" : "bg-accent"
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
    return <Loader />;
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error || !match) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020817] px-4 text-white">
        <div className="rounded-xl border border-white/10 text-text-muted p-8 text-center">
          <h2 className="text-lg font-bold">Match unavailable</h2>

          <p className="mt-2 text-sm text-text-muted">
            {error || "Match not found"}
          </p>

          <button
            onClick={() => navigate("/upcoming-matches")}
            className="mt-5 rounded-lg bg-primary px-5 py-2 text-sm font-bold"
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

      <div className="sticky top-0 z-50 border-b border-white/10 bg-background/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <button
            onClick={() => navigate("/matches")}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-accent hover:text-accent"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:border-accent hover:text-accent disabled:opacity-50"
            >
              <Download size={15} />
              Download
            </button>

            <button
              onClick={handleShare}
              disabled={generating}
              className="inline-flex items-center gap-2 rounded-lg border border-accent/60 bg-accent/10 px-3 py-2 text-xs font-bold uppercase tracking-wider text-accent transition hover:bg-accent/20 disabled:opacity-50"
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
            className="relative overflow-hidden bg-background text-text"
            style={{
              width: POSTER_WIDTH,
              height: POSTER_HEIGHT,
              minWidth: POSTER_WIDTH,
            }}
          >
            {/* ==================================================
                BACKGROUND
            ================================================== */}
            <div className="absolute inset-0 bg-[url('/assets/matchbg.jpeg')] bg-cover bg-center bg-no-repeat" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,8,23,0.20)_0%,rgba(2,8,23,0.32)_45%,rgba(2,8,23,0.42)_100%)]" />{" "}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_35%,rgba(14,95,216,0.36),transparent_42%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_35%,rgba(73,200,90,0.28),transparent_42%)]" />
            {/* ==================================================
                CONTENT
            ================================================== */}
            <div className="relative z-2 flex h-full flex-col px-6 pb-6 pt-6">
              {/* ==================================================
                  HEADER
              ================================================== */}

              <header className="mb-7 flex items-center justify-center gap-5">
                {/* CUBIC FC Logo */}
                <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
                  {/* Ambient gold glow */}
                  <div className="absolute inset-3 rounded-full bg-accent/20 blur-2xl" />

                  {/* Subtle blue glow */}
                  <div className="absolute inset-5 rounded-full bg-primary/20 blur-xl" />

                  <img
                    src="/assets/cubic-fc-logo.png"
                    alt="CUBIC FC"
                    className="
                      relative z-10
                      h-full w-full
                      object-contain
                      drop-shadow-[0_0_10px_rgba(212,175,55,0.25)]
                      drop-shadow-[0_8px_18px_rgba(0,0,0,0.35)]
                    "
                  />
                </div>

                {/* Vertical divider */}
                <div className="h-20 w-px bg-gradient-to-b from-transparent via-accent/60 to-transparent" />

                {/* Match Information */}
                <div className="min-w-0 text-left flex items-center flex-col">
                  {/* Match type */}
                  <h2 className="text-md mb-2 font-bold uppercase tracking-[0.3em] text-accent font-minasans">
                    {schedule.matchType || "FRIENDLY"} MATCH
                  </h2>

                  {/* Format */}
                  <h2 className="font-minasans text-5xl font-bold uppercase leading-[0.9] tracking-[-1.5px] text-text">
                    {schedule.matchFormat}
                    <span className="text-secondary">V</span>
                    {schedule.matchFormat}
                  </h2>

                  {/* Competition label */}
                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-px w-8 bg-accent/70" />

                    <span className="text-lg font-bold uppercase font-minasans tracking-[0.28em] text-accent">
                      FUTSAL
                    </span>

                    <span className="h-px w-8 bg-accent/70" />
                  </div>
                </div>
              </header>

              {/* ==================================================
                  TEAMS AREA
              ================================================== */}

              <div className="relative mt-4.25 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_130px_minmax(0,1fr)] items-stretch">
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
                  <div className="relative my-3.25 flex h-105 w-45 shrink-0 items-center justify-center px-4">
                    {/* Glow behind VS */}
                    <div className="absolute h-72 w-32 rounded-full bg-yellow-400/30 blur-3xl" />

                    <img
                      src="/assets/vsv.png"
                      alt="VS"
                      className="relative z-10 h-75 w-50 max-w-none object-fill"
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

              <div className="mt-6 py-2 grid shrink-0 grid-cols-[1fr_1.25fr_1fr] overflow-hidden rounded-lg border-[1.5px] border-accent bg-[rgba(3,12,29,0.94)]">
                {/* Date */}
                <div className="flex min-w-0 items-center gap-2 border-r border-accent/45 px-2 py-base last:border-r-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[#07111F]">
                    <CalendarDays size={19} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-base font-minasans font-bold uppercase leading-none tracking-[1px] text-accent">
                      DATE
                    </span>
                    <strong className="block truncate text-md font-bold leading-[1.15] text-text">
                      {formatDate(schedule.date)}
                    </strong>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex min-w-0 items-center gap-2 border-r border-accent/45 px-2 py-base last:border-r-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[#07111F]">
                    <MapPin size={19} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-base font-minasans font-bold uppercase leading-none tracking-[1px] text-accent">
                      VENUE
                    </span>
                    <strong className="block truncate text-md font-bold leading-[1.15] text-text">
                      {schedule.venue?.venue || "Venue unavailable"}
                    </strong>
                  </div>
                </div>

                {/* Time */}
                <div className="flex min-w-0 items-center gap-2 px-2 py-base">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-[#07111F]">
                    <Clock3 size={19} />
                  </div>

                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="text-base font-minasans font-bold uppercase leading-none tracking-[1px] text-accent">
                      TIME
                    </span>
                    <strong className="block truncate text-md font-bold leading-[1.15] text-text">
                      {schedule.time || "Time unavailable"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  FOOTER
              ================================================== */}

              <footer className="mt-6 shrink-0 text-center text-sm font-extrabold uppercase tracking-[2px] text-secondary">
                CUBIC FC • EST. 2012 • CUBIC EDUCATION, CHITTAGONG
              </footer>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MatchDetails;

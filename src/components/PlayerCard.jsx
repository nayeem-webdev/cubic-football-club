import { useRef } from "react";
import {
  Trophy,
  Footprints,
  Calendar1Icon,
  Shield,
  Share2,
  Star,
  SportShoe,
  Goal,
  UserPlus2,
  Medal,
  ShieldMinus,
  Shirt,
  Crown,
  LandPlot,
} from "lucide-react";
import { toPng } from "html-to-image";
import { positionColors } from "../constants/positionColors";

// Compact StatCard with minimal vertical footprint
const StatCard = ({ icon, label, value = 0, valueColor, children }) => (
  <div
    className="rounded-lg p-2 text-center transition duration-300 hover:scale-105"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid var(--color-border)",
    }}
  >
    {/* ICON AND NUMBER SIDE-BY-SIDE */}
    <div className="flex items-center justify-center gap-1.5">
      <div style={{ color: valueColor || "var(--color-secondary)" }}>
        {icon}
      </div>

      {children ? (
        children
      ) : (
        <h4
          className="text-base font-bold leading-none"
          style={{ color: valueColor || "inherit" }}
        >
          {value}
        </h4>
      )}
    </div>

    {/* LABEL DOWN */}
    <p
      className="mt-1 text-[10px] leading-none"
      style={{ color: "var(--color-text-muted)" }}
    >
      {label}
    </p>
  </div>
);

const PlayerCard = ({ player, index }) => {
  const cardRef = useRef(null);

  const stats = player?.stats || {};
  const club = player?.playsFor || null;

  // ============================================================
  // AGE CALCULATOR
  // ============================================================
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "-";

    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const age = calculateAge(player?.dateOfBirth);

  // ============================================================
  // AVERAGE POINTS
  // ============================================================
  const averagePoints =
    stats.appearances > 0
      ? (Number(stats.playerScore || 0) / stats.appearances).toFixed(1)
      : "0.0";

  // ============================================================
  // LAST 5 FORM
  // ============================================================
  const last5 = Array.isArray(stats.last5) ? stats.last5 : [];

  // Helper for dynamic colors based on match outcomes
  const getOutcomeStyles = (type) => {
    switch (type) {
      case "W":
        return {
          bg: "rgba(34,197,94,0.14)",
          border: "rgba(34,197,94,0.30)",
          text: "#22c55e",
        };
      case "L":
        return {
          bg: "rgba(239,68,68,0.14)",
          border: "rgba(239,68,68,0.30)",
          text: "#ef4444",
        };
      case "D":
        return {
          bg: "rgba(245,158,11,0.14)",
          border: "rgba(245,158,11,0.30)",
          text: "#f59e0b",
        };
      default:
        return {
          bg: "rgba(255,255,255,0.06)",
          border: "rgba(255,255,255,0.10)",
          text: "var(--color-text-muted)",
        };
    }
  };

  // ============================================================
  // SHARE HANDLER
  // ============================================================
  const handleShare = async () => {
    const element = cardRef.current;

    if (!element) {
      console.error("Player card element not found");
      return;
    }

    try {
      await document.fonts.ready;

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 4,
        backgroundColor: "#152640",
      });

      const link = document.createElement("a");
      link.download = `${player?.name || "player"}-player-card.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div
      ref={cardRef}
      className="
        group
        overflow-hidden
        rounded-2xl
        transition-all
        duration-300
        hover:-translate-y-1
      "
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 15px 40px rgba(0,0,0,.25)",
      }}
    >
      {/* =========================================================
          PLAYER IMAGE
      ========================================================== */}
      <div className="relative aspect-square overflow-hidden bg-[#0E1D34]">
        {player?.photo ? (
          <img
            src={player.photo}
            alt={player?.name || "Player"}
            className="
              h-full
              w-full
              object-cover
              transition
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Shield size={70} style={{ color: "var(--color-secondary)" }} />
          </div>
        )}

        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-[#07111F]/70 via-transparent to-transparent" />

        {/* JERSEY NUMBER */}
        <div
          className="
      absolute
      left-4
      top-4
      flex
      items-center
      gap-1.5
      rounded-full
      border
      border-accent/30
      bg-[#07111F]/85
      px-3
      py-1.5
      text-sm
      font-bold
      text-accent
      shadow-lg
      backdrop-blur-md
    "
        >
          <Shirt
            size={16}
            strokeWidth={2.2}
            className="text-accent fill-accent"
          />

          <span className="leading-none">#{player?.jerseyNumber ?? "0"}</span>
        </div>

        {/* RANKING */}
        {index < 12 && (
          <div
            className="
      absolute
      right-4
      top-4
      flex
      items-center
      gap-1.5
      rounded-full
      border
      border-secondary/30
      bg-[#07111F]/85
      px-3
      py-1.5
      text-sm
      font-bold
      text-secondary
      shadow-lg
      backdrop-blur-md
    "
          >
            <Crown
              size={16}
              strokeWidth={2.2}
              className="text-secondary fill-secondary"
            />

            <span className="leading-none">#{index + 1}</span>
          </div>
        )}

        {/* SCORE */}
        <div
          className="
            absolute
            bottom-4
            right-4
            flex
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
          "
          style={{
            background: "rgba(7,17,31,0.88)",
            border: "1px solid rgba(212,175,55,0.18)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
          }}
        >
          <Star
            size={16}
            className="text-secondary"
            fill="currentColor"
            strokeWidth={2}
          />
          <span className="text-lg font-bold leading-none text-secondary">
            {averagePoints}
          </span>
          <div className="h-4 w-px bg-accent" />
          <span className="text-xs font-semibold text-white/60">
            {stats.playerScore ?? 0} pts
          </span>
        </div>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================== */}
      <div className="p-4">
        {/* PLAYER INFO */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="min-w-0 truncate text-xl font-bold tracking-tight text-white">
                {player?.name || "Unknown Player"}
              </h2>

              <span
                className="
      inline-flex shrink-0 items-center justify-center
      rounded-md
      border border-white/10
      px-2 py-0.5
      gap-1
      text-[11px] font-extrabold uppercase tracking-wider
      text-white
      shadow-sm
    "
                style={{
                  background:
                    positionColors[player?.position] || "var(--color-primary)",
                }}
              >
                <LandPlot size={14} /> {player?.position || "-"}
              </span>
            </div>

            <p
              className="mt-0.5 truncate text-xs font-medium"
              style={{ color: "var(--color-text-muted)" }}
            >
              {club?.name || "Free Agent"}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            {club?.logoLow ? (
              <img
                src={club.logoLow}
                alt={club?.name || "Club"}
                className="h-full w-full object-contain"
              />
            ) : (
              <Shield size={20} style={{ color: "var(--color-secondary)" }} />
            )}
          </div>
        </div>

        {/* COMPACT STATS */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <StatCard
            icon={<UserPlus2 size={15} />}
            label="Apps"
            value={stats.appearances ?? 0}
          />
          <StatCard
            icon={<Goal size={15} />}
            label="Goals"
            value={stats.goals ?? 0}
          />
          <StatCard
            icon={<SportShoe size={15} />}
            label="Assists"
            value={stats.assists ?? 0}
          />
          <StatCard
            icon={<Trophy size={15} />}
            label="Win"
            value={stats.wins ?? 0}
          />
          <StatCard
            icon={<Medal size={15} />}
            label="Draw"
            value={stats.draws ?? 0}
          />
          <StatCard
            icon={<ShieldMinus size={15} />}
            label="Lose"
            value={stats.losses ?? 0}
          />
        </div>

        {/* LAST 5 FORM + WIN POINTS */}
        <div
          className="
            mt-2.5
            flex
            items-center
            justify-between
            rounded-lg
            px-3
            py-2
          "
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* FORM BADGES */}
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: "var(--color-text-muted)" }}
            >
              Form
            </span>

            <div className="flex gap-1">
              {last5.length > 0 ? (
                last5.map((result, index) => {
                  const style = getOutcomeStyles(result);
                  return (
                    <span
                      key={`${result}-${index}`}
                      className="
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-md
                        text-[9px]
                        font-bold
                      "
                      style={{
                        background: style.bg,
                        border: `1px solid ${style.border}`,
                        color: style.text,
                      }}
                    >
                      {result}
                    </span>
                  );
                })
              ) : (
                <span
                  className="text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  No matches
                </span>
              )}
            </div>
          </div>

          {/* DYNAMIC WIN POINTS */}
          <div className="flex items-center gap-1">
            <span
              className="text-xs font-bold"
              style={{ color: "var(--color-accent)" }}
            >
              {stats.winRate ?? 0}%
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--color-text-muted)" }}
            >
              win
            </span>
          </div>
        </div>

        {/* FOOT & AGE DETAILS */}
        <div
          className="
            mt-4
            grid
            grid-cols-[1fr_auto_1fr]
            items-center
            gap-2
            border-t
            pt-3
          "
          style={{ borderColor: "var(--color-border)" }}
        >
          {/* FOOT */}
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <Footprints
                size={14}
                style={{ color: "var(--color-secondary)" }}
              />
            </div>
            <div className="min-w-0">
              <p
                className="text-[9px] uppercase tracking-wide"
                style={{ color: "var(--color-text-muted)" }}
              >
                Foot
              </p>
              <p className="truncate text-xs font-semibold">
                {player?.foot || "-"}
              </p>
            </div>
          </div>

          {/* SHARE BUTTON */}
          <button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${player?.name || "player"} card`}
            className="
              group/share
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              opacity-60
              transition-all
              duration-300
              hover:scale-110
              hover:opacity-100
              hover:drop-shadow-[0_0_8px_var(--color-secondary)]
              active:scale-90
            "
            style={{ color: "var(--color-secondary)" }}
          >
            <Share2
              size={15}
              className="transition-transform duration-500 group-hover/share:rotate-180"
            />
          </button>

          {/* AGE */}
          <div className="flex min-w-0 items-center justify-end gap-2">
            <div className="min-w-0 text-right">
              <p
                className="text-[9px] uppercase tracking-wide"
                style={{ color: "var(--color-text-muted)" }}
              >
                Age
              </p>
              <p className="text-xs font-semibold">{age}</p>
            </div>
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--color-surface)" }}
            >
              <Calendar1Icon
                size={14}
                style={{ color: "var(--color-secondary)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

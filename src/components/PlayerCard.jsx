import { useRef } from "react";
import {
  Trophy,
  Target,
  Users,
  Footprints,
  Calendar1Icon,
  Shield,
  Hash,
  Share2,
  Star,
} from "lucide-react";
import { toPng } from "html-to-image";
import { positionColors } from "../constants/positionColors";

const StatCard = ({ icon, label, value = 0 }) => (
  <div
    className="rounded-lg p-2.5 text-center transition duration-300 hover:scale-105"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid var(--color-border)",
    }}
  >
    <div
      className="mb-1.5 flex justify-center"
      style={{ color: "var(--color-secondary)" }}
    >
      {icon}
    </div>

    <h4 className="text-lg font-bold">{value}</h4>

    <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
      {label}
    </p>
  </div>
);

const PlayerCard = ({ player }) => {
  const cardRef = useRef(null);

  const stats = player?.stats || {};
  const club = player?.playsFor || null;

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
      className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 15px 40px rgba(0,0,0,.25)",
      }}
    >
      {/* =========================
          PLAYER IMAGE
      ========================== */}
      <div className="relative aspect-square overflow-hidden bg-[#0E1D34]">
        {player?.photo ? (
          <img
            src={player.photo}
            alt={player?.name || "Player"}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Shield
              size={70}
              style={{
                color: "var(--color-secondary)",
              }}
            />
          </div>
        )}

        {/* Subtle image overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-[#07111F]/70 via-transparent to-transparent" />

        {/* Jersey Number */}
        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#07111F]/80 px-3 py-2 text-sm font-bold backdrop-blur-sm">
          <Hash size={15} />
          {player?.jerseyNumber ?? "-"}
        </div>

        {/* Position */}
        <span
          className="absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-bold text-white shadow-lg"
          style={{
            background:
              positionColors[player?.position] || "var(--color-primary)",
          }}
        >
          {player?.position || "-"}
        </span>

        {/* Score */}
        <div
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg px-3 py-2"
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
            {Number.isFinite(stats.playerScore / stats.appearances)
              ? (stats.playerScore / stats.appearances).toFixed(1)
              : "0.0"}
          </span>

          <div className="h-4 w-px bg-accent" />

          <span className="text-xs font-semibold text-white/60">
            {stats.playerScore ?? 0} pts
          </span>
        </div>
      </div>

      {/* =========================
          CONTENT
      ========================== */}
      <div className="p-5">
        {/* Player Info */}
        <div className="flex items-center justify-between gap-4">
          {/* Name + Club */}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-2xl font-bold">
              {player?.name || "Unknown Player"}
            </h2>

            <p
              className="mt-1 truncate font-medium"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {club?.name || "Free Agent"}
            </p>
          </div>

          {/* Club Logo */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center">
            {club?.logoLow ? (
              <img
                src={club.logoLow}
                alt={club?.name || "Club"}
                className="h-full w-full object-contain"
              />
            ) : (
              <Shield
                size={24}
                style={{
                  color: "var(--color-secondary)",
                }}
              />
            )}
          </div>
        </div>

        {/* =========================
            STATS
        ========================== */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <StatCard
            icon={<Users size={17} />}
            label="Apps"
            value={stats.appearances ?? 0}
          />

          <StatCard
            icon={<Target size={17} />}
            label="Goals"
            value={stats.goals ?? 0}
          />

          <StatCard
            icon={<Trophy size={17} />}
            label="Assists"
            value={stats.assists ?? 0}
          />
        </div>

        {/* =========================
            PLAYER DETAILS
        ========================== */}
        <div
          className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t pt-4"
          style={{
            borderColor: "var(--color-border)",
          }}
        >
          {/* Foot */}
          <div className="flex min-w-0 items-center gap-2">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--color-surface)",
              }}
            >
              <Footprints
                size={16}
                style={{
                  color: "var(--color-secondary)",
                }}
              />
            </div>

            <div className="min-w-0">
              <p
                className="text-[10px] uppercase tracking-wide"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                Foot
              </p>

              <p className="truncate text-sm font-semibold">
                {player?.foot || "-"}
              </p>
            </div>
          </div>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            aria-label={`Share ${player?.name || "player"} card`}
            className="
              group/share
              flex h-9 w-9 items-center justify-center
              rounded-full
              opacity-60
              transition-all duration-300
              hover:scale-110
              hover:opacity-100
              hover:drop-shadow-[0_0_8px_var(--color-secondary)]
              active:scale-90
            "
            style={{
              color: "var(--color-secondary)",
            }}
          >
            <Share2
              size={17}
              className="
                transition-transform duration-500
                group-hover/share:rotate-180
              "
            />
          </button>

          {/* Age */}
          <div className="flex min-w-0 items-center justify-end gap-2">
            <div className="min-w-0 text-right">
              <p
                className="text-[10px] uppercase tracking-wide"
                style={{
                  color: "var(--color-text-muted)",
                }}
              >
                Age
              </p>

              <p className="text-sm font-semibold">{age}</p>
            </div>

            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{
                backgroundColor: "var(--color-surface)",
              }}
            >
              <Calendar1Icon
                size={16}
                style={{
                  color: "var(--color-secondary)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;

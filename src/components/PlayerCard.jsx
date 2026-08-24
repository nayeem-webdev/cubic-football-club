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
} from "lucide-react";
import { toPng } from "html-to-image";
import { positionColors } from "../constants/positionColors";

const StatCard = ({ icon, label, value = 0 }) => (
  <div
    className="rounded-lg p-2 text-center transition duration-300 hover:scale-105"
    style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid var(--color-border)",
    }}
  >
    <div
      className="mb-2 flex justify-center"
      style={{ color: "var(--color-secondary)" }}
    >
      {icon}
    </div>

    <h4 className="text-xl font-bold">{value}</h4>

    <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
      {label}
    </p>
  </div>
);

const PlayerCard = ({ player }) => {
  const cardRef = useRef(null);
  const handleShare = async () => {
    const element = cardRef.current;

    console.log("Share clicked");
    console.log("Element:", element);

    if (!element) {
      console.error("Player card element not found");
      return;
    }

    try {
      await document.fonts.ready;

      console.log("Generating image...");

      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#152640",
      });

      const link = document.createElement("a");
      link.download = `${player.name}-player-card.png`;
      link.href = dataUrl;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  // Calculate age from dateOfBirth
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

  const age = calculateAge(player.dateOfBirth);

  return (
    <div
      ref={cardRef}
      className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-2"
      style={{
        background: "var(--color-card)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 15px 40px rgba(0,0,0,.25)",
      }}
    >
      {/* Player Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0E1D34]">
        <img
          src={player.photo}
          alt={player.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Position */}
        <span
          className="absolute right-4 top-4 rounded-full px-4 py-2 text-sm font-bold text-white"
          style={{
            background:
              positionColors[player.position] || "var(--color-primary)",
          }}
        >
          {player.position}
        </span>

        {/* Jersey Number */}
        <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-[#07111F]/80 px-3 py-2 text-sm font-bold backdrop-blur-sm">
          <Hash size={15} />
          {player.jerseyNumber}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Player Info */}
        <div className="flex items-center justify-between gap-4">
          {/* Name & Club */}
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">{player.name}</h2>

            <p
              className="mt-1 font-medium"
              style={{
                color: "var(--color-text-muted)",
              }}
            >
              {player.playsFor}
            </p>
          </div>

          {/* Club Logo */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center ">
            {player.clubLogo ? (
              <img
                src={player.clubLogo}
                alt={player.playsFor}
                className="h-full w-full object-contain"
              />
            ) : (
              <Shield size={22} style={{ color: "var(--color-secondary)" }} />
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <StatCard
            icon={<Users size={16} />}
            label="Apps"
            value={player.appearances ?? 0}
          />

          <StatCard
            icon={<Target size={16} />}
            label="Goals"
            value={player.goals ?? 0}
          />

          <StatCard
            icon={<Trophy size={16} />}
            label="Assists"
            value={player.assists ?? 0}
          />
        </div>

        {/* Player Details */}
        <div
          className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-t pt-4"
          style={{
            borderColor: "var(--color-border)",
          }}
        >
          {/* Foot */}
          <div className="flex items-center gap-2 min-w-0">
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

              <p className="text-sm font-semibold truncate">
                {player.foot || "-"}
              </p>
            </div>
          </div>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            aria-label="Share player"
            className="
    group
    flex h-9 w-9 items-center justify-center
    rounded-full
    opacity-60
    transition-all duration-300
    hover:opacity-100
    hover:scale-110
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
      group-hover:rotate-180
    "
            />
          </button>

          {/* Age */}
          <div className="flex items-center justify-end gap-2 min-w-0">
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

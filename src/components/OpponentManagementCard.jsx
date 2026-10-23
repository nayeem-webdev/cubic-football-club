import { Copy, Check, Pencil, LandPlot, Shirt } from "lucide-react";
import { useState } from "react";
import { positionColors } from "../constants/positionColors";

export default function OpponentManagementCard({ player, onEdit, onCopyId }) {
  const [copied, setCopied] = useState(false);

  const club = player?.playsFor;

  const handleCopy = async () => {
    if (!player?._id) return;

    try {
      await navigator.clipboard.writeText(player._id);
      setCopied(true);
      onCopyId?.(player._id);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to copy player ID:", error);
    }
  };

  return (
    <article className="group p-4 relative overflow-hidden rounded-2xl bg-card shadow-md backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-secondary/10">
      {/* HEADER SECTION */}
      <div className="flex items-center gap-3.5 mb-4">
        {/* PLAYER PHOTO WITH CORNER BADGE */}
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/80 shadow-inner">
          <img
            src={player?.photo}
            alt={player?.name || "Player Avatar"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* PLAYER INFO & POSITION */}
        <div className="min-w-0 w-full flex items-center justify-between pt-0.5">
          <div className="mb-1">
            <h2 className="truncate text-base font-bold text-text leading-snug">
              {player?.name}
            </h2>
            <span className="block truncate text-xs font-bold text-text-muted">
              {club?.name || "Free Agent"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="inline-flex shrink-0 items-center justify-center rounded-md px-2 py-0.5 gap-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm bg-primary">
              <Shirt size={14} /> {player?.jerseyNumber || "00"}
            </span>

            <span
              className="inline-flex shrink-0 items-center justify-center rounded-md px-2 py-0.5 gap-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm"
              style={{
                background:
                  positionColors[player?.position] || "var(--color-primary)",
              }}
            >
              <LandPlot size={14} /> {player?.position || "-"}
            </span>
          </div>
        </div>
      </div>

      {/* CARD ACTION BUTTONS */}
      <div className="flex gap-2">
        {/* COPY ID */}
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy Player ID"
          className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.97] w-full rounded-lg bg-primary font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy ID</span>
            </>
          )}
        </button>

        {/* EDIT BUTTON */}
        <button
          type="button"
          onClick={() => onEdit?.(player)}
          aria-label="Edit Player"
          className="flex flex-1 items-center justify-center gap-2 px-3 py-2 text-xs shadow-md shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 active:scale-[0.97] w-full rounded-lg bg-primary font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil size={14} />
          <span>Edit Profile</span>
        </button>
      </div>
    </article>
  );
}

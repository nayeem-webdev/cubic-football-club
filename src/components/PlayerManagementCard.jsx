import {
  Copy,
  Check,
  Pencil,
  Footprints,
  Calendar,
  Tag,
  Hash,
  Activity,
  User,
} from "lucide-react";
import { useState } from "react";

export default function PlayerManagementCard({ player, onEdit, onCopyId }) {
  const [copied, setCopied] = useState(false);

  const stats = player?.stats || {};
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

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "retired":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "inactive":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "backup":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-surface text-text-muted border-border";
    }
  };

  const getFormStyle = (result) => {
    switch (result?.toUpperCase()) {
      case "P":
        return "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-500/10";
      case "A":
        return "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-sm shadow-amber-500/10";
      default:
        return "bg-surface border-border text-text-muted";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
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

          <span
            className={`rounded-md border px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${getStatusBadge(
              player?.status,
            )}`}
          >
            {player?.status || "unknown"}
          </span>
        </div>
      </div>

      {/* PLAYER DETAILS GRID */}
      <div className="grid grid-cols-3 gap-1 text-xs mb-4">
        {/* NO. */}
        <div className="bg-surface p-2.5 rounded-sm">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
            <Hash size={11} className="text-secondary shrink-0" /> No.
          </span>
          <p className="mt-1 font-bold tabular-nums text-text">
            #{player?.jerseyNumber ?? "-"}
          </p>
        </div>

        {/* POSITION */}
        <div className="bg-surface p-2.5 rounded-sm">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
            <Tag size={11} className="text-secondary shrink-0" /> Pos
          </span>
          <p className="mt-1 font-bold truncate text-text">
            {player?.position || "-"}
          </p>
        </div>

        {/* FOOT */}
        <div className="bg-surface p-2.5 rounded-sm">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
            <Footprints size={11} className="text-secondary shrink-0" /> Foot
          </span>
          <p className="mt-1 capitalize font-bold text-text">
            {player?.foot || "-"}
          </p>
        </div>

        {/* DOB */}
        <div className="bg-surface p-2.5 rounded-sm">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
            <Calendar size={11} className="text-secondary shrink-0" /> DOB
          </span>
          <p className="mt-1 truncate text-[11px] font-bold text-text">
            {formatDate(player?.dob || player?.dateOfBirth)}
          </p>
        </div>

        {/* APPS */}
        <div className="bg-surface p-2.5 rounded-sm">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
            <User size={11} className="text-secondary shrink-0" /> APPS
          </span>
          <p className="mt-1 truncate text-[11px] font-bold text-text">
            {stats.appearances ?? 0}
          </p>
        </div>

        {/* FORM */}
        <div className="bg-surface p-2.5 rounded-sm">
          <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-text-muted">
            <Activity size={11} className="text-secondary shrink-0" /> Form
          </span>
          <div className="mt-1 flex items-center gap-1">
            {Array.isArray(stats.participatedLast5) &&
            stats.participatedLast5.length > 0 ? (
              stats.participatedLast5.map((result, index) => (
                <span
                  key={`${result}-${index}`}
                  className={`rounded-xs aspect-square px-1 text-[11px] font-black uppercase ${getFormStyle(
                    result,
                  )}`}
                >
                  {result}
                </span>
              ))
            ) : (
              <span className="text-[10px] text-text-muted italic">
                No data
              </span>
            )}
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

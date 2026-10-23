import { useEffect } from "react";
import {
  Save,
  Trash2,
  Shirt,
  CalendarDays,
  Footprints,
  Image as ImageIcon,
  Users,
} from "lucide-react";

export default function ModalEditPlayer({
  player,
  formData,
  clubs = [],
  onChange,
  onSave,
  onCancel,
  onDelete,
  loading = false,
}) {
  // Lock background scroll
  useEffect(() => {
    if (!player) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [player]);

  // Escape key handler
  useEffect(() => {
    if (!player) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [player, onCancel]);

  const getClubName = (clubId) => {
    const club = clubs.find((club) => club._id === clubId);
    return club?.name || "Unknown Club";
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
        return "bg-background text-text-muted border-border";
    }
  };

  if (!player) return null;

  const photo =
    formData?.photo ||
    player?.photo ||
    "https://i.ibb.co.com/FkM6gH66/placeholder-8.png";

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-card text-text shadow-2xl p-5 md:p-8">
        {/* =========================================================
            HEADER: COMPACT & SIMPLE
        ========================================================= */}

        <div className="flex items-center gap-3.5 px-5 pt-5">
          {/* PLAYER PHOTO WITH CORNER BADGE */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/80 shadow-inner">
            <img
              src={photo}
              alt={player?.name || "Player"}
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
                {getClubName(formData.playsFor)}
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

        {/* =========================================================
            FORM BODY: SINGLE CLEAN GRID
        ========================================================= */}
        <div className="min-h-0 flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {/* NAME */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text">
                Player Name
              </label>
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={onChange}
                placeholder="Enter player name"
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-xs text-text outline-none transition focus:border-secondary"
              />
            </div>

            {/* JERSEY NUMBER */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-text">
                Jersey Number
              </label>
              <div className="relative">
                <Shirt
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData?.jerseyNumber ?? ""}
                  onChange={onChange}
                  min="0"
                  max="99"
                  placeholder="10"
                  className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-text outline-none transition focus:border-secondary"
                />
              </div>
            </div>

            {/* DATE OF BIRTH */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-text">
                Date of Birth
              </label>
              <div className="relative">
                <CalendarDays
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={
                    formData?.dateOfBirth
                      ? String(formData.dateOfBirth).slice(0, 10)
                      : ""
                  }
                  onChange={onChange}
                  className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-text outline-none transition focus:border-secondary"
                />
              </div>
            </div>

            {/* POSITION */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-text">
                Position
              </label>
              <select
                name="position"
                value={formData?.position || ""}
                onChange={onChange}
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-text outline-none transition focus:border-secondary"
              >
                <option value="">Select position</option>
                <option value="GK">Goalkeeper (GK)</option>
                <option value="DF">Defender (DF)</option>
                <option value="MF">Midfielder (MF)</option>
                <option value="FW">Forward (FW)</option>
                <option value="ST">Striker (ST)</option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-text">
                Status
              </label>
              <select
                name="status"
                value={formData?.status || ""}
                onChange={onChange}
                className="h-9 w-full rounded-lg border border-border bg-background px-2.5 text-xs text-text outline-none transition focus:border-secondary"
              >
                <option value="">Select status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="retired">Retired</option>
              </select>
            </div>

            {/* PREFERRED FOOT */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-text">
                Preferred Foot
              </label>
              <div className="relative">
                <Footprints
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <select
                  name="foot"
                  value={formData?.foot || ""}
                  onChange={onChange}
                  className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-2.5 text-xs text-text outline-none transition focus:border-secondary"
                >
                  <option value="">Select foot</option>
                  <option value="Right">Right</option>
                  <option value="Left">Left</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            {/* CLUB */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-text">
                Club
              </label>
              <div className="relative">
                <Users
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <select
                  name="playsFor"
                  value={formData?.playsFor || ""}
                  onChange={onChange}
                  className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-2.5 text-xs text-text outline-none transition focus:border-secondary"
                >
                  <option value="">Free Agent</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* PHOTO URL */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-text">
                Photo URL
              </label>
              <div className="relative">
                <ImageIcon
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-muted"
                />
                <input
                  type="url"
                  name="photo"
                  value={formData?.photo || ""}
                  onChange={onChange}
                  placeholder="https://example.com/photo.jpg"
                  className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-text outline-none transition focus:border-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================
            FOOTER: MINIMAL ACTIONS
        ========================================================= */}
        <div className="flex items-center justify-between border-t border-border bg-background/30 px-5 py-3">
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="flex items-center gap-1.5 h-9 rounded-lg border  px-4 text-xs font-semibold border-red-600 bg-red-600/15 text-red-600 transition hover:bg-red-400/15 hover:border-red-400 hover:text-red-400 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="h-9 rounded-lg border border-border bg-background px-4 text-xs font-semibold text-text-muted transition hover:border-secondary  hover:text-text disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={loading}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-xs font-semibold text-white transition hover:bg-secondary active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

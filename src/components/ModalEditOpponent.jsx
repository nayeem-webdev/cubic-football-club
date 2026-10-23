import { useEffect } from "react";
import {
  Save,
  Trash2,
  Shirt,
  Image as ImageIcon,
  Users,
  X,
} from "lucide-react";

export default function ModalEditOpponent({
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

  // Escape key
  useEffect(() => {
    if (!player) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [player, onCancel]);

  const getClubName = (clubId) => {
    const club = clubs.find((club) => club._id === clubId);
    return club?.name || "Unknown Team";
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
        {/* =====================================================
            HEADER
        ====================================================== */}
        <div className="flex items-center gap-3.5">
          {/* PLAYER IMAGE */}
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface ring-1 ring-border/80 shadow-inner">
            <img
              src={photo}
              alt={player?.name || "Player"}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          {/* PLAYER INFO */}
          <div className="min-w-0 w-full flex items-center justify-between pt-0.5">
            <div className="mb-1">
              <h2 className="truncate text-base font-bold text-text leading-snug">
                {player?.name}
              </h2>
              <span className="block truncate text-xs font-bold text-text-muted">
                {getClubName(formData.playsFor)}
              </span>
            </div>
          </div>

          {/* CLOSE */}
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex h-9 w-9 aspect-square items-center justify-center rounded-lg border border-border bg-background text-text-muted transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
          >
            <X />
          </button>
        </div>

        {/* =====================================================
            FORM
        ====================================================== */}
        <div className="min-h-0 flex-1 overflow-y-auto py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* PLAYER NAME */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Player Name
              </label>

              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={onChange}
                placeholder="Enter player name"
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text outline-none transition focus:border-secondary"
              />
            </div>

            {/* JERSEY NUMBER */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Jersey Number
              </label>

              <div className="relative">
                <Shirt
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="number"
                  name="jerseyNumber"
                  value={formData?.jerseyNumber ?? ""}
                  onChange={onChange}
                  min="0"
                  max="99"
                  placeholder="10"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text outline-none transition focus:border-secondary"
                />
              </div>
            </div>

            {/* POSITION */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Position
              </label>

              <select
                name="position"
                value={formData?.position || ""}
                onChange={onChange}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-xs text-text outline-none transition focus:border-secondary"
              >
                <option value="">Select position</option>
                <option value="GK">Goalkeeper (GK)</option>
                <option value="DF">Defender (DF)</option>
                <option value="MF">Midfielder (MF)</option>
                <option value="FW">Forward (FW)</option>
                <option value="ST">Striker (ST)</option>
              </select>
            </div>

            {/* TEAM */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Team
              </label>

              <div className="relative">
                <Users
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <select
                  name="playsFor"
                  value={formData?.playsFor || ""}
                  onChange={onChange}
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text outline-none transition focus:border-secondary"
                >
                  <option value="">Select team</option>

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
              <label className="mb-1.5 block text-xs font-semibold text-text">
                Player Image URL
              </label>

              <div className="relative">
                <ImageIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                />

                <input
                  type="url"
                  name="photo"
                  value={formData?.photo || ""}
                  onChange={onChange}
                  placeholder="https://example.com/player.jpg"
                  className="h-10 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-text outline-none transition focus:border-secondary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER
        ====================================================== */}
        <div className="flex items-center justify-between border-t border-border pt-5">
          {/* DELETE */}
          <button
            type="button"
            onClick={onDelete}
            disabled={loading}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-red-600 bg-red-600/10 px-4 text-xs font-semibold text-red-500 transition hover:bg-red-600/20 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete
          </button>

          {/* RIGHT ACTIONS */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="h-9 rounded-lg border border-border bg-background px-4 text-xs font-semibold text-text-muted transition hover:border-secondary hover:text-text disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => onSave(player._id)}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

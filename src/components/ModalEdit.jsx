import { FilePen, Trash, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const eventLabels = {
  goal: "Goal",
  penalty: "Penalty",
  ownGoal: "Own Goal",
  card: "Card",
  substitution: "Substitution",
};

const eventIcons = {
  goal: "⚽",
  penalty: "🥅",
  ownGoal: "🏐",
  card: "📕",
  substitution: "🔄",
};

const formatEventTime = (seconds = 0) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds,
  ).padStart(2, "0")}`;
};

export default function ModalEdit({
  editEventsModal,
  selectedMatch,
  closeEditEventsModal,
  updateMatchEvent,
  deleteMatchEvent,
}) {
  const [editingEvent, setEditingEvent] = useState(null);
  const [editData, setEditData] = useState(null);

  /*
   * Get ALL players from this match.
   *
   * IMPORTANT:
   * We keep the exact player structure from your JSON:
   * _id
   * name
   * position
   * jerseyNumber
   * photo
   */
  const allPlayers = useMemo(() => {
    if (!selectedMatch) return [];

    return [
      ...(selectedMatch.homeStartingPlayers || []).map((player) => ({
        ...player,
        team: "home",
      })),

      ...(selectedMatch.homeSubstitutes || []).map((player) => ({
        ...player,
        team: "home",
      })),

      ...(selectedMatch.awayStartingPlayers || []).map((player) => ({
        ...player,
        team: "away",
      })),

      ...(selectedMatch.awaySubstitutes || []).map((player) => ({
        ...player,
        team: "away",
      })),
    ];
  }, [selectedMatch]);

  /*
   * Players filtered by event team.
   */
  const getPlayersForTeam = (team) => {
    return allPlayers.filter((player) => player.team === team);
  };

  /*
   * Find player name using the _id stored in matchEvents.
   */
  const getPlayerName = (playerId) => {
    const player = allPlayers.find((player) => player._id === playerId);

    return player
      ? `${player.name} (#${player.jerseyNumber})`
      : "Unknown Player";
  };

  // const getTeamName = (team) => {
  //   if (!selectedMatch) return team;

  //   return team === "home"
  //     ? selectedMatch.homeTeam.name
  //     : selectedMatch.awayTeam.name;
  // };

  /*
   * Close modal and reset edit state.
   */
  useEffect(() => {
    if (!editEventsModal) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditingEvent(null);
      setEditData(null);
    }
  }, [editEventsModal]);

  if (!editEventsModal || !selectedMatch) {
    return null;
  }

  /*
   * Start editing one event.
   *
   * IMPORTANT:
   * We copy the event so we don't directly modify
   * selectedMatch.matchEvents.
   */
  const handleEdit = (event) => {
    setEditingEvent(event.id);
    setEditData({ ...event });
  };

  /*
   * Cancel editing.
   */
  const handleCancelEdit = () => {
    setEditingEvent(null);
    setEditData(null);
  };

  /*
   * Delete event by its exact event.id.
   */
  const handleDelete = (eventId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) return;

    deleteMatchEvent(eventId);

    if (editingEvent === eventId) {
      setEditingEvent(null);
      setEditData(null);
    }
  };

  /*
   * Save edited event.
   */
  const handleSave = () => {
    if (!editData) return;

    /*
     * Basic validation.
     */
    if (!editData.team) {
      alert("Please select a team.");
      return;
    }

    if (!editData.time && editData.time !== 0) {
      alert("Please enter event time.");
      return;
    }

    /*
     * Goal
     */
    if (editData.type === "goal") {
      if (!editData.scorer) {
        alert("Please select a scorer.");
        return;
      }
    }

    /*
     * Penalty
     */
    if (editData.type === "penalty") {
      if (!editData.scorer) {
        alert("Please select a scorer.");
        return;
      }
    }

    /*
     * Own Goal
     */
    if (editData.type === "ownGoal") {
      if (!editData.scorer) {
        alert("Please select a scorer.");
        return;
      }
    }

    /*
     * Card
     */
    if (editData.type === "card") {
      if (!editData.player) {
        alert("Please select a player.");
        return;
      }

      if (!editData.card) {
        alert("Please select a card.");
        return;
      }
    }

    /*
     * Substitution
     */
    if (editData.type === "substitution") {
      if (!editData.playerOut) {
        alert("Please select playerOut.");
        return;
      }

      if (!editData.playerIn) {
        alert("Please select playerIn.");
        return;
      }
    }

    updateMatchEvent(editData);

    setEditingEvent(null);
    setEditData(null);
  };

  /*
   * Update editData without changing the original event.
   */
  const handleChange = (field, value) => {
    setEditData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /*
   * When team changes, clear player fields.
   * This prevents accidentally using a player from the
   * previous team.
   */
  const handleTeamChange = (team) => {
    setEditData((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        team,
        scorer: "",
        player: "",
        playerOut: "",
        playerIn: "",
      };
    });
  };

  /*
   * Render player select.
   */
  const renderPlayerSelect = ({
    value,
    field,
    label,
    team,
    includeEmpty = true,
  }) => {
    const players = getPlayersForTeam(team);

    return (
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-[#B8C2D1]">
          {label}
        </label>

        <select
          value={value || ""}
          onChange={(event) => handleChange(field, event.target.value)}
          className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8]"
        >
          {includeEmpty && <option value="">Select player</option>}

          {players.map((player) => (
            <option key={player._id} value={player._id}>
              #{player.jerseyNumber} - {player.name}
            </option>
          ))}
        </select>
      </div>
    );
  };

  /*
   * Render edit form depending on event.type.
   */
  const renderEditForm = () => {
    if (!editData) return null;

    // const teamPlayers = getPlayersForTeam(editData.team);

    return (
      <div className="space-y-4">
        {/* EVENT TYPE - READ ONLY */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#B8C2D1]">
            Event Type
          </label>

          <div className="flex items-center gap-2 rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2.5">
            <span className="text-lg">{eventIcons[editData.type] || "📌"}</span>

            <span className="text-sm font-semibold text-[#F8FAFC]">
              {eventLabels[editData.type] || editData.type}
            </span>
          </div>
        </div>

        {/* TEAM */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#B8C2D1]">
            Team
          </label>

          <select
            value={editData.team || ""}
            onChange={(event) => handleTeamChange(event.target.value)}
            className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8]"
          >
            <option value="">Select team</option>
            <option value="home">{selectedMatch.homeTeam.name}</option>
            <option value="away">{selectedMatch.awayTeam.name}</option>
          </select>
        </div>

        {/* GOAL */}
        {editData.type === "goal" && (
          <>
            {renderPlayerSelect({
              value: editData.scorer,
              field: "scorer",
              label: "Scorer",
              team: editData.team,
            })}

            {renderPlayerSelect({
              value: editData.assister,
              field: "assister",
              label: "Assister",
              team: editData.team,
            })}
          </>
        )}

        {/* PENALTY */}
        {editData.type === "penalty" &&
          renderPlayerSelect({
            value: editData.scorer,
            field: "scorer",
            label: "Scorer",
            team: editData.team,
          })}

        {/* OWN GOAL */}
        {editData.type === "ownGoal" &&
          renderPlayerSelect({
            value: editData.scorer,
            field: "scorer",
            label: "Scorer",
            team: editData.team,
          })}

        {/* CARD */}
        {editData.type === "card" && (
          <>
            {renderPlayerSelect({
              value: editData.player,
              field: "player",
              label: "Player",
              team: editData.team,
            })}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[#B8C2D1]">
                Card
              </label>

              <select
                value={editData.card || ""}
                onChange={(event) => handleChange("card", event.target.value)}
                className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8]"
              >
                <option value="">Select card</option>
                <option value="yellow">Yellow</option>
                <option value="red">Red</option>
              </select>
            </div>
          </>
        )}

        {/* SUBSTITUTION */}
        {editData.type === "substitution" && (
          <>
            {renderPlayerSelect({
              value: editData.playerOut,
              field: "playerOut",
              label: "Player Out",
              team: editData.team,
            })}

            {renderPlayerSelect({
              value: editData.playerIn,
              field: "playerIn",
              label: "Player In",
              team: editData.team,
            })}
          </>
        )}

        {/* TIME */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-[#B8C2D1]">
            Time (seconds)
          </label>

          <input
            type="number"
            min="0"
            value={editData.time ?? ""}
            onChange={(event) =>
              handleChange(
                "time",
                event.target.value === "" ? "" : Number(event.target.value),
              )
            }
            className="w-full rounded-lg border border-[#28466B] bg-[#07111F] px-3 py-2.5 text-sm text-[#F8FAFC] outline-none transition focus:border-[#0E5FD8]"
          />

          <p className="mt-1 text-[10px] text-[#B8C2D1]/50">
            Display time: {formatEventTime(Number(editData.time) || 0)}
          </p>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2 pt-2">
          <button
            type="button"
            onClick={handleCancelEdit}
            className="flex-1 rounded-lg border border-[#28466B] bg-[#07111F] px-4 py-2.5 text-xs font-bold text-[#B8C2D1] transition hover:border-[#3A82FF] hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-lg bg-[#0E5FD8] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#3A82FF]"
          >
            Save
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-[#28466B] bg-[#0E1D34] shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#28466B] px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-[#F8FAFC]">
              Edit Match Events
            </h2>

            <p className="mt-0.5 text-[10px] uppercase tracking-wider text-[#B8C2D1]/50">
              {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}
            </p>
          </div>

          <button
            type="button"
            onClick={closeEditEventsModal}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#28466B] bg-[#07111F] text-[#B8C2D1] transition hover:border-red-500/50 hover:text-red-400"
          >
            ✕
          </button>
        </div>

        {/* BODY */}
        <div className="max-h-[calc(90vh-75px)] overflow-y-auto p-4 sm:p-5">
          {selectedMatch.matchEvents?.length === 0 ? (
            <div className="rounded-xl border border-[#28466B] bg-[#07111F] px-4 py-10 text-center">
              <div className="text-3xl">📋</div>

              <p className="mt-3 text-sm font-semibold text-[#F8FAFC]">
                No events yet
              </p>

              <p className="mt-1 text-xs text-[#B8C2D1]/50">
                Goals, penalties, cards and substitutions will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(selectedMatch.matchEvents || []).map((event) => {
                const isEditing = editingEvent === event.id;

                return (
                  <div
                    key={event.id}
                    className="rounded-xl border border-[#28466B] bg-[#07111F] p-3"
                  >
                    {/* EVENT DISPLAY */}
                    {!isEditing && (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            {/* Emoji */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0E5FD8]/10 text-xl">
                              {eventIcons[event.type] || "📌"}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-[10px] font-bold text-[#F8FAFC]">
                                  {eventLabels[event.type] || event.type}
                                </h3>

                                <span className="rounded-md bg-[#0E5FD8]/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[#3A82FF]">
                                  {event.team}
                                </span>

                                <span className="text-[10px] font-semibold text-[#D4AF37]">
                                  {formatEventTime(event.time)}
                                </span>
                              </div>

                              {/* GOAL */}
                              {event.type === "goal" && (
                                <div className="mt-1 text-xs text-[#B8C2D1]">
                                  <span className="font-semibold text-white">
                                    {getPlayerName(event.scorer)}
                                  </span>

                                  {event.assister && (
                                    <>
                                      <span className="mx-1 text-[#B8C2D1]/40">
                                        assisted by
                                      </span>

                                      <span className="font-semibold text-white">
                                        {getPlayerName(event.assister)}
                                      </span>
                                    </>
                                  )}
                                </div>
                              )}

                              {/* PENALTY */}
                              {event.type === "penalty" && (
                                <div className="mt-1 text-xs text-[#B8C2D1]">
                                  Scorer:{" "}
                                  <span className="font-semibold text-white">
                                    {getPlayerName(event.scorer)}
                                  </span>
                                </div>
                              )}

                              {/* OWN GOAL */}
                              {event.type === "ownGoal" && (
                                <div className="mt-1 text-xs text-[#B8C2D1]">
                                  Scorer:{" "}
                                  <span className="font-semibold text-white">
                                    {getPlayerName(event.scorer)}
                                  </span>
                                </div>
                              )}

                              {/* CARD */}
                              {event.type === "card" && (
                                <div className="mt-1 text-xs text-[#B8C2D1]">
                                  <span className="font-semibold text-white">
                                    {getPlayerName(event.player)}
                                  </span>

                                  <span className="mx-1 text-[#B8C2D1]/40">
                                    •
                                  </span>

                                  <span
                                    className={
                                      event.card === "red"
                                        ? "font-bold text-red-400"
                                        : "font-bold text-[#D4AF37]"
                                    }
                                  >
                                    {event.card === "red"
                                      ? "Red Card"
                                      : "Yellow Card"}
                                  </span>
                                </div>
                              )}

                              {/* SUBSTITUTION */}
                              {event.type === "substitution" && (
                                <div className="mt-1 text-xs text-[#B8C2D1]">
                                  <span className="font-semibold text-red-400">
                                    {getPlayerName(event.playerOut)}
                                  </span>

                                  <span className="mx-2 text-[#B8C2D1]/40">
                                    →
                                  </span>

                                  <span className="font-semibold text-[#49C85A]">
                                    {getPlayerName(event.playerIn)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* BUTTONS */}
                          <div className="flex shrink-0 flex-col items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleEdit(event)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#0E5FD8]/30 bg-[#0E5FD8]/10 text-[10px] font-bold text-[#3A82FF] transition hover:bg-[#0E5FD8]/20"
                            >
                              <FilePen size={14} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(event.id)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-[10px] font-bold text-red-400 transition hover:bg-red-500/20"
                            >
                              <Trash size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {/* EDIT FORM */}
                    {isEditing && (
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-[#F8FAFC]">
                              Edit {eventLabels[event.type]}
                            </h3>
                          </div>

                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/10 text-[10px] font-bold text-red-400 transition hover:bg-red-500/20"
                          >
                            <X size={14} />
                          </button>
                        </div>

                        {renderEditForm()}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

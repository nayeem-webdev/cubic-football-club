import { useState } from "react";
import PageHero from "../components/PageHero";
import AddOpponentPlayer from "../components/AddOpponentPlayer";
import AddOpponentTeam from "../components/AddOpponentTeam";
import { FaUserPlus, FaUsers } from "react-icons/fa6";

const AddOpponent = () => {
  const [activeTab, setActiveTab] = useState("player");

  const tabClass = (tab) =>
    `flex items-center justify-center gap-2 rounded-md px-2 py-2 text-[12px] font-semibold transition sm:px-5 ${
      activeTab === tab
        ? "bg-primary text-white shadow-lg"
        : "text-text-muted hover:bg-card hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <PageHero
          text="CUBIC FC"
          heading="Add Opponent"
          subheading="Add an opponent team and its players to their squad."
        />

        {/* Form Card */}
        <div className="rounded-2xl bg-card text-text p-6 shadow-2xl md:p-8">
          {/* Tabs */}
          <div
            className="grid grid-cols-2 gap-3 rounded-lg bg-background border border-border text-text-muted p-2 mb-4"
            role="tablist"
            aria-label="Add opponent"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "player"}
              onClick={() => setActiveTab("player")}
              className={tabClass("player")}
            >
              <FaUserPlus className="text-base" />
              Add Player
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "team"}
              onClick={() => setActiveTab("team")}
              className={tabClass("team")}
            >
              <FaUsers className="text-base" />
              Add Team
            </button>
          </div>

          {/* Active Form */}
          <div role="tabpanel">
            {activeTab === "player" && <AddOpponentPlayer />}
            {activeTab === "team" && <AddOpponentTeam />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOpponent;

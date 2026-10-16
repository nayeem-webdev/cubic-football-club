import { useState } from "react";
import PageHero from "../components/PageHero";
import AddOpponentPlayer from "../components/AddOpponentPlayer";
import AddOpponentTeam from "../components/AddOpponentTeam";
import { FaUserPlus, FaUsers } from "react-icons/fa6";

const AddOpponent = () => {
  const [activeTab, setActiveTab] = useState("player");

  const tabClass = (tab) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-300 sm:flex-none ${
      activeTab === tab
        ? "bg-primary text-white shadow-md shadow-secondary/20"
        : "text-text-muted hover:bg-card hover:text-accent"
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
        <div className="rounded-2xl border border-border text-text-muted p-6 shadow-2xl md:p-8">
          {/* Tabs */}
          <div
            className="mb-6 flex w-full gap-2 rounded-xl border border-border bg-background p-1.5 sm:w-fit"
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

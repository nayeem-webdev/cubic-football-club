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
        ? "bg-[#0E5FD8] text-white shadow-md shadow-blue-900/20"
        : "text-[#B8C2D1] hover:bg-[#152640] hover:text-[#D4AF37]"
    }`;

  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <PageHero
          text="CUBIC FC"
          heading="Add Opponent"
          subheading="Add an opponent team and its players to their squad."
        />

        {/* Form Card */}
        <div className="rounded-2xl border border-[#28466B] bg-[#0E1D34] p-6 shadow-2xl md:p-8">
          {/* Tabs */}
          <div
            className="mb-6 flex w-full gap-2 rounded-xl border border-[#28466B] bg-[#07111F] p-1.5 sm:w-fit"
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

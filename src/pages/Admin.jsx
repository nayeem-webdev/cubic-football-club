import { Link } from "react-router-dom";
import {
  UserPlus,
  Pencil,
  ShieldPlus,
  CalendarPlus,
  Trophy,
  Radio,
} from "lucide-react";
import PageHero from "../components/PageHero";

const adminItems = [
  {
    title: "Register Player",
    description: "Add a new player to the club.",
    icon: UserPlus,
    path: "/register-player",
  },
  {
    title: "Update Player",
    description: "Edit existing player information.",
    icon: Pencil,
    path: "/update-player",
  },
  {
    title: "Register Team",
    description: "Create and manage teams.",
    icon: ShieldPlus,
    path: "/register-team",
  },
  {
    title: "Add Schedule",
    description: "Create a new match schedule.",
    icon: CalendarPlus,
    path: "/add-schedule",
  },
  {
    title: "New Match",
    description: "Set up a new football match.",
    icon: Trophy,
    path: "/new-match",
  },
  {
    title: "Live Match",
    description: "Control the live match scoreboard.",
    icon: Radio,
    path: "/live-match",
  },
];

export default function Admin() {
  return (
    <div className="min-h-screen bg-[#07111F] px-4 py-10 text-[#F8FAFC]">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="ADMIN"
          heading="Admin Dashboard"
          subheading="Manage players, teams, schedules, and live matches."
        />

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="group rounded-2xl border border-[#28466B] bg-[#0E1D34] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0E5FD8] hover:bg-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0E5FD8]/15 text-[#3A82FF] transition group-hover:bg-[#0E5FD8] group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#F8FAFC]">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-[#B8C2D1]">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-[#3A82FF]">
                  Manage
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

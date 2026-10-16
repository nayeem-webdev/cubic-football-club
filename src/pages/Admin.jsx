import { Link } from "react-router-dom";
import {
  UserPlus,
  ShieldPlus,
  CalendarPlus,
  Trophy,
  Radio,
  ClipboardPen,
  CalendarSync,
  UserPen,
  ShieldUser,
} from "lucide-react";
import PageHero from "../components/PageHero";

const adminItems = [
  {
    title: "Live Scoreboard",
    description: "Control the live match scoreboard.",
    icon: Radio,
    path: "/live-match",
  },
  {
    title: "Create Match",
    description: "Set up a new football match.",
    icon: Trophy,
    path: "/new-match",
  },
  {
    title: "Update Match",
    description: "Update match information.",
    icon: ClipboardPen,
    path: "/update-match",
  },
  {
    title: "Register Player",
    description: "Add a new player to the club.",
    icon: UserPlus,
    path: "/register-player",
  },
  {
    title: "Update Player",
    description: "Edit existing player information.",
    icon: UserPen,
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
    title: "Update Schedule",
    description: "Edit existing match schedule.",
    icon: CalendarSync,
    path: "/update-schedule",
  },
  {
    title: "Add Opponent",
    description: "Add other club team as opponent.",
    icon: ShieldPlus,
    path: "/add-opponent",
  },
  {
    title: "Update Opponent",
    description: "Update Players of other club.",
    icon: ShieldUser,
    path: "/update-opponent-player",
  },
];

export default function Admin() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 text-text">
      <div className="mx-auto max-w-7xl">
        <PageHero
          text="ADMIN"
          heading="Admin Dashboard"
          subheading="Manage players, teams, schedules, and live matches."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {adminItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="group rounded-2xl border border-border text-muted p-6 transition duration-300 hover:-translate-y-1 hover:border-[#0E5FD8] hover:bg-card"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-secondary transition group-hover:bg-primary group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-text">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-muted">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-secondary">
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

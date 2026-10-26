import {
  House,
  CalendarDays,
  Trophy,
  Users,
  Shield,
  Swords,
} from "lucide-react";

const navItems = [
  { icon: House, href: "/", label: "Home" },
  { icon: Swords, href: "/matches", label: "Matches" },
  { icon: Trophy, href: "/score", label: "Scores" },
  { icon: Users, href: "/players", label: "Players" },
  { icon: CalendarDays, href: "/schedule", label: "Schedules" },
  { icon: Shield, href: "/teams", label: "Teams" },
];

export default function FloatingNavbar() {
  return (
    <nav className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 xl:bottom-auto xl:left-auto xl:right-6 xl:top-1/2 xl:translate-x-0 xl:-translate-y-1/2">
      <div className="relative flex flex-row items-center gap-1 overflow-hidden rounded-full border border-border/60 bg-surface/80 px-2 py-1.5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,.45)] xl:flex-col xl:gap-3 xl:p-3">
        {navItems.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={label}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-secondary xl:h-12 xl:w-12"
          >
            <Icon size={18} strokeWidth={2} className="xl:h-5.5 xl:w-5.5" />

            <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-text opacity-0 translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 xl:block">
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

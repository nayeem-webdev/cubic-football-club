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
    <nav className="fixed bottom-3 left-1/2 z-50 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:right-6 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2">
      <div className="relative flex flex-row items-center gap-1 overflow-hidden rounded-full border border-border/60 bg-surface/80 px-2 py-1.5 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,.45)] lg:flex-col lg:gap-3 lg:p-3">
        {navItems.map(({ icon: Icon, href, label }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={label}
            className="group relative flex h-10 w-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:text-secondary lg:h-12 lg:w-12"
          >
            <Icon
              size={18}
              strokeWidth={2}
              className="lg:h-[22px] lg:w-[22px]"
            />

            <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-text opacity-0 translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 lg:block">
              {label}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

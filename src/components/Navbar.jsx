import { House, CalendarDays, Trophy, Users, Shield } from "lucide-react";

const navItems = [
  { icon: House, href: "/", label: "Home" },
  { icon: CalendarDays, href: "/schedule", label: "Schedule" },
  { icon: Trophy, href: "/matches", label: "Matches" },
  { icon: Users, href: "/players", label: "Players" },
  { icon: Shield, href: "#teams", label: "Teams" },
];

export default function FloatingNavbar() {
  return (
    <nav
      className="
        fixed
        z-50

        bottom-4 left-1/2 -translate-x-1/2
        lg:bottom-auto lg:left-auto
        lg:right-6 lg:top-1/2
        lg:translate-x-0 lg:-translate-y-1/2
      "
    >
      <div
        className="
relative
    overflow-hidden

    flex flex-row lg:flex-col
    items-center
    gap-2 lg:gap-3

    rounded-full
    border border-border/60
    bg-surface/80
    backdrop-blur-2xl

    px-3 py-2
    lg:p-3

    shadow-[0_20px_60px_rgba(0,0,0,.45)]
          border border-border/60
          bg-surface/80
          backdrop-blur-2xl

          px-3 py-2
          lg:p-3

          shadow-[0_20px_60px_rgba(0,0,0,.45)]
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <a
              key={item.label}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              className="
                group
                relative

                flex
                h-12
                w-12
                items-center
                justify-center

                rounded-full

                text-text-muted
                transition-all
                duration-300

                hover:bg-primary/10
                hover:text-secondary
                hover:scale-110
              "
            >
              <Icon size={22} strokeWidth={2} />

              {/* Tooltip (Desktop Only) */}
              <span
                className="
                  hidden lg:block

                  absolute
                  right-16

                  whitespace-nowrap

                  rounded-lg
                  border border-border
                  bg-card

                  px-3
                  py-1.5

                  text-sm
                  font-medium
                  text-text

                  opacity-0
                  translate-x-2
                  pointer-events-none

                  transition-all
                  duration-300

                  group-hover:opacity-100
                  group-hover:translate-x-0
                "
              >
                {item.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

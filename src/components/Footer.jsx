import logo from "/assets/cubic-fc-logo.png";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Schedule", href: "#schedule" },
  { name: "Matches", href: "#matches" },
  { name: "Players", href: "#players" },
  { name: "Teams", href: "#teams" },
];

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Main */}
        <div className="flex flex-col items-center justify-between gap-10 lg:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-5">
            <img src={logo} alt="CUBIC FC" className="max-w-16 " />

            <div className="border-l border-secondary pl-5">
              <h1 className="text-2xl font-bold tracking-wide text-text">
                CUBIC
                <span className="block text-secondary">FOOTBALL CLUB</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {navLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-text-muted transition-colors duration-300 hover:text-secondary"
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-sm md:flex-row">
          <p className="text-text-muted">
            © {new Date().getFullYear()} CUBIC FC. All rights reserved.
          </p>

          <p className="text-text-muted">
            Designed with ❤️ by{" "}
            <a
              href="https://www.linkedin.com/in/nayeem-webdev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary transition-colors hover:text-secondary"
            >
              nayeem-webdev
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

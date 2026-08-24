import { ArrowRight, ShieldCheck } from "lucide-react";

import stadium from "/assets/stadium.jpg";
import logo from "/assets/cubic-fc-logo-500.png";
import { Link } from "react-router-dom";

const HomeHero = () => {
  return (
    <section
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${stadium})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-background/90" />

      {/* Ambient Glows */}
      <div className="absolute left-0 top-0 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-blue-600/20 blur-[100px] sm:blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-64 w-64 sm:h-96 sm:w-96 rounded-full bg-yellow-400/10 blur-[100px] sm:blur-[150px]" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-4 sm:px-6 text-center">
        {" "}
        <p className="inline-block rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-md text-yellow-400 font-medium">
          EST. 2012 • CHITTAGONG
        </p>
        <div className="max-w-7xl  flex self-center mt-8 ">
          <div className="border-r-2 border-secondary pr-5 mr-5 md:pr-10 md:mr-10">
            <img
              src={logo}
              alt="Cubic FC"
              className="drop-shadow-[0_20px_60px_rgba(212,175,55,.45)] max-w-50 h-auto block"
            />
          </div>

          <div className="">
            <h1 className="mt-8 text-3xl sm:text-5xl text-left lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white">
              CUBIC
              <br />
              <span className="text-secondary">FOOTBALL CLUB</span>
            </h1>
          </div>
        </div>
        <p className="mt-8 max-w-xl text-center text-sm lg:text-lg leading-relaxed text-gray-300 lg:text-left">
          Where education meets football excellence. We build discipline,
          teamwork, and champions on and off the pitch. Weekly football matches,
          friendly competitions, and an amazing football community in
          Chattogram.
        </p>
        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
          {/* Match Schedule */}
          <Link
            to="/schedule"
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#D4AF37]/5 px-6 py-3.5 font-semibold text-[#D4AF37] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-lg hover:shadow-[#D4AF37]/10 active:scale-95 sm:w-auto"
          >
            Match Schedule
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* Matches */}
          <Link
            to="/matches"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#28466B] bg-[#0E1D34] px-6 py-3.5 font-semibold text-[#F8FAFC] transition-all duration-300 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] active:scale-95 sm:w-auto"
          >
            <ShieldCheck size={18} />
            Matches
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;

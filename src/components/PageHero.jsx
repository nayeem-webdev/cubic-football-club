const PageHero = ({ text, heading, subheading }) => {
  return (
    <section
      className="border-b"
      style={{
        background:
          "linear-gradient(135deg,var(--color-surface),var(--color-background))",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10 lg:py-16">
        <span className="text-sm lg:text-base text-secondary uppercase tracking-widest">
          {text}
        </span>

        <h1 className="text-5xl lg:text-7xl font-bold mt-3">{heading}</h1>

        <p className="text-base lg:text-lg text-text-muted mt-4 max-w-2xl">
          {subheading}
        </p>
      </div>
    </section>
  );
};

export default PageHero;
